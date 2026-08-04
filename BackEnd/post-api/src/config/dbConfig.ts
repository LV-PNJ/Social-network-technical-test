import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Post } from '../models/Post';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  username: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
  password: process.env.DB_PASS || process.env.POSTGRES_PASSWORD || '',
  database: process.env.DB_NAME || process.env.POSTGRES_DB || 'devexp',
  synchronize: true,
  entities: [User, Post],
});
