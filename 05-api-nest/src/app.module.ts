import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { envSchema } from './env';
import { PrismaService } from './prisma/prisma.service';

@Module({
  // validate env variables for the project
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
