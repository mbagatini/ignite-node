import { JwtAuthGuard } from '@/auth/jwt-auth-guard';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';

const pageQuerySchema = z.coerce.number().optional().default(1);

type PageQueryParamSchema = z.infer<typeof pageQuerySchema>;

const pageQueryParamPipe = new ZodValidationPipe(pageQuerySchema);

@Controller('/questions/recent')
@UseGuards(JwtAuthGuard)
export class GetRecentQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', pageQueryParamPipe) page: PageQueryParamSchema) {
    const PAGE_SIZE = 20;

    const questions = await this.prisma.question.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { questions };
  }
}
