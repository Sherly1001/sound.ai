export class AppConfig {
  port: number;
  database: {
    url: string;
    log: boolean;
    enableSync: boolean;
    runMigrations: boolean;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  storage: {
    dir: string;
  };
}

function config(): AppConfig {
  return {
    port: parseInt(process.env.PORT) || 3000,
    database: {
      url: process.env.DATABASE_URL || '',
      log: process.env.DATABASE_LOG == 'true',
      enableSync: process.env.DATABASE_SYNC == 'true',
      runMigrations: process.env.DATABASE_RUN_MIGRATIONS == 'true',
    },
    jwt: {
      secret: process.env.JWT_SECRET_KEY || '',
      expiresIn: process.env.JWT_EXPIRE || '60 days',
    },
    storage: {
      dir: process.env.STORAGE_DIRECTORY || './data',
    },
  };
}

export default config;
