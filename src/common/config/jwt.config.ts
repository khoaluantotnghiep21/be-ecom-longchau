import { registerAs } from '@nestjs/config';
import { JwtConfig } from './interface/jwt-config.interface';

export default registerAs(
  'jwt',
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET ?? 'default',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  }),
);
