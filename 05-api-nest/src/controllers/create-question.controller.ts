import { AuthenticatedUser } from '@/auth/authenticated-user.decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth-guard';
import { UserPayload } from '@/auth/jwt.strategy';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';

const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionSchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionSchema);

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @AuthenticatedUser() user: UserPayload,
  ) {
    const { title, content } = createQuestionSchema.parse(body);

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    return this.prisma.question.create({
      data: {
        slug,
        title,
        content,
        authorId: user.sub,
      },
    });
  }
}
