import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Env } from 'src/env';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService<Env, true>) {
        const jwtPrivateKey = configService.get('JWT_PRIVATE_KEY', {
          infer: true,
        });
        const jwtPublicKey = configService.get('JWT_PUBLIC_KEY', {
          infer: true,
        });

        return {
          signOptions: { algorithm: 'RS256' },
          jwtPrivateKey: Buffer.from(jwtPrivateKey, 'base64'),
          jwtPublicKey: Buffer.from(jwtPublicKey, 'base64'),
        };
      },
    }),
  ],
})
export class AuthModule {}
