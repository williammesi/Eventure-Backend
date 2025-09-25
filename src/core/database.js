import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import { env } from 'node:process';

const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    dialect: 'mysql',
    dialectModule: mysql2,
    port: env.DB_PORT,
  }
);

export default sequelize;