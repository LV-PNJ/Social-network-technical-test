import { useEffect, useState } from 'react';
import { Alert, Collapse } from '@mui/material';

type ServiceKey = 'identity' | 'posts';

const ENDPOINTS: Record<ServiceKey, string> = {
  identity: `${import.meta.env.VITE_IDENTITY_URL || 'http://localhost:8081/api'}`.replace(
    /\/api\/?$/,
    '/actuator/health'
  ),
  posts: `${import.meta.env.VITE_API_URL || 'http://localhost:8876/api'}/health`,
};

async function probe(url: string, ms = 2500): Promise<boolean> {
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(t);
  }
}

/**
 * Shows a controlled banner when Identity or Posts are unreachable.
 * Does not crash the UI — auth/forms still render with a clear message.
 */
export default function ServiceStatusBanner() {
  const [down, setDown] = useState<ServiceKey[]>([]);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const [idOk, postsOk] = await Promise.all([
        probe(ENDPOINTS.identity),
        probe(ENDPOINTS.posts),
      ]);
      if (cancelled) return;
      const next: ServiceKey[] = [];
      if (!idOk) next.push('identity');
      if (!postsOk) next.push('posts');
      setDown(next);
    };
    check();
    const id = window.setInterval(check, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const identityDown = down.includes('identity');
  const postsDown = down.includes('posts');

  return (
    <Collapse in={down.length > 0}>
      <Alert severity="warning" sx={{ borderRadius: 0 }}>
        {identityDown && postsDown && (
          <>
            Identity y Posts no responden. Revisa <code>docker compose ps</code>. Login y
            feed no estarán disponibles hasta recuperar los servicios.
          </>
        )}
        {identityDown && !postsDown && (
          <>
            El servicio de Identity no está disponible. No podrás iniciar sesión ni ver
            perfiles; el feed puede seguir si ya tienes un token válido.
          </>
        )}
        {!identityDown && postsDown && (
          <>
            El servicio de Posts no está disponible. Login funciona, pero el feed y los
            likes no cargarán hasta que Posts vuelva.
          </>
        )}
      </Alert>
    </Collapse>
  );
}
