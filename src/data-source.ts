// DataSource.ts esto es escensial para correr migraciones con el cli de typeorm

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Product, ProductImage } from './products/entities';
import { User } from './auth/entities/user.entity';

dotenv.config(); // carga variables de .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Product, ProductImage, User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
