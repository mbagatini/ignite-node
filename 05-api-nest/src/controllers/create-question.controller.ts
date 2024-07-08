import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { z } from 'zod';

const CreateQuestionSchema = z.object({
  title: z.string(),
  description: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof CreateQuestionSchema>;

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(CreateQuestionSchema))
  async handle(@Body() body: CreateQuestionBodySchema) {
    return { ok: true };

    // const { email, name, password } = CreateQuestionSchema.parse(body);

    // return this.prisma.question.create({
    //   data: {
    //     ...body,
    //   },
    // });
  }
}
