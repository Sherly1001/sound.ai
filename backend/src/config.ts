export class AppConfig {
  port: number;
  database: {
    url: string;
    log: boolean;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

function config(): AppConfig {
  return {
    port: parseInt(process.env.PORT) || 3000,
    database: {
      url: process.env.DATABASE_URL || '',
      log: process.env.DATABASE_LOG == 'true',
    },
    jwt: {
      secret: process.env.JWT_SECRET_KEY || '',
      expiresIn: process.env.JWT_EXPIRE || '60 days',
    },
  };
}

export default config;
