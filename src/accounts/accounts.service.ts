import { Injectable } from '@nestjs/common'
import type { PrismaService } from '@prisma-service/prisma.service'

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUser(userId: string) {
    return this.prisma.account.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'asc' },
    })
  }
}
