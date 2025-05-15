import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Post } from '../models/Post';
import dotenv from 'dotenv';

dotenv.config(); // 👈 Carga variables de entorno

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: '123456', // 👈 ahora usa el valor del .env
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User, Post],
});
