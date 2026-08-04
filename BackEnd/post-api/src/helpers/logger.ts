import fs from 'fs';
import path from 'path';

type LogFields = Record<string, unknown>;
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const SERVICE = 'posts-service';
const COLORS_ENABLED =
  (process.env.LOG_COLORS ?? 'true').toLowerCase() !== 'false' &&
  process.env.NO_COLOR === undefined;

const LOG_TO_FILE = (process.env.LOG_TO_FILE ?? 'true').toLowerCase() !== 'false';
const LOG_DIR = process.env.LOG_DIR || process.env.LOG_PATH || 'logs';
const LOG_FILE = process.env.LOG_FILE || path.join(LOG_DIR, 'posts-service.log');

const ANSI: Record<LogLevel | 'reset' | 'dim' | 'cyan', string> = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

let fileReady = false;

function ensureLogFile(): void {
  if (!LOG_TO_FILE || fileReady) return;
  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fileReady = true;
  } catch {
    fileReady = false;
  }
}

function colorize(level: LogLevel, text: string): string {
  if (!COLORS_ENABLED) return text;
  return `${ANSI[level]}${text}${ANSI.reset}`;
}

function formatConsole(level: LogLevel, message: string, fields: LogFields): string {
  const ts = new Date().toISOString();
  const levelLabel = colorize(level, level.toUpperCase().padEnd(5));
  const prefix = COLORS_ENABLED
    ? `${ANSI.dim}${ts}${ANSI.reset} ${levelLabel} ${ANSI.cyan}[${SERVICE}]${ANSI.reset}`
    : `${ts} ${level.toUpperCase().padEnd(5)} [${SERVICE}]`;

  const extraKeys = Object.keys(fields);
  if (extraKeys.length === 0) {
    return `${prefix} ${message}`;
  }
  const extras = JSON.stringify(fields);
  return `${prefix} ${message} ${COLORS_ENABLED ? `${ANSI.dim}${extras}${ANSI.reset}` : extras}`;
}

function write(level: LogLevel, message: string, fields: LogFields = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: SERVICE,
    ...fields,
  };

  const consoleLine = formatConsole(level, message, fields);
  if (level === 'error') {
    console.error(consoleLine);
  } else if (level === 'warn') {
    console.warn(consoleLine);
  } else {
    console.log(consoleLine);
  }

  if (LOG_TO_FILE) {
    ensureLogFile();
    if (fileReady) {
      try {
        fs.appendFileSync(LOG_FILE, `${JSON.stringify(entry)}\n`, 'utf8');
      } catch {
        // avoid recursive logging on disk errors
      }
    }
  }
}

export const logger = {
  debug: (message: string, fields?: LogFields) => write('debug', message, fields),
  info: (message: string, fields?: LogFields) => write('info', message, fields),
  warn: (message: string, fields?: LogFields) => write('warn', message, fields),
  error: (message: string, fields?: LogFields) => write('error', message, fields),
};
