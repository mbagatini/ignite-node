import { ConflictException } from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { email, name, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    return this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }
}
