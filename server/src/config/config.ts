import { Config } from './config.interface';

export const config = (): Config => ({
  port: Number(process.env.SERVER_PORT),
  host: process.env.SERVER_HOST,
  nodeEnv: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: Number(process.env.JWT_EXPIRATION),
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    uri: process.env.DB_URI
  }
});
