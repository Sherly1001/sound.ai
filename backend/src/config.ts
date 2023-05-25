export class AppConfig {
  port: number;
  database: {
    url: string;
  };
}

function config(): AppConfig {
  return {
    port: parseInt(process.env.PORT) || 3000,
    database: {
      url: process.env.DATABASE_URL || '',
    },
  };
}

export default config;
