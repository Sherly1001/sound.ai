export class AppConfig {
  port: number;
  database: {
    url: string;
    log: boolean;
    enableSync: boolean;
    runMigrations: boolean;
    ssl: boolean;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  storage: {
    dir: string;
  };
  mqtt: {
    url: string;
    username?: string;
    password?: string;
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
      ssl: !(process.env.DATABASE_SSL == 'false'),
    },
    jwt: {
      secret: process.env.JWT_SECRET_KEY || '',
      expiresIn: process.env.JWT_EXPIRE || '60 days',
    },
    storage: {
      dir: process.env.STORAGE_DIRECTORY || './data',
    },
    mqtt: {
      url: process.env.MQTT_URL || '',
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    },
  };
}

export default config;
