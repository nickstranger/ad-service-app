export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  uri: string;
}

export interface Config {
  port: number;
  host: string;
  nodeEnv: string;
  jwtSecret: string;
  jwtExpiration: number;
  database: DatabaseConfig;
}
