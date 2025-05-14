import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './interface/database-config.interface';

export default registerAs(
    'database',
    (): DatabaseConfig => ({
      type: 'postgres', 
      host: process.env.DB_HOST ?? 'localhost', 
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432, 
      username: process.env.DB_USERNAME ?? 'postgres', 
      password: process.env.DB_PASSWORD ?? 'password', 
      database: process.env.DB_NAME ?? 'my_database',     
    }),
  );