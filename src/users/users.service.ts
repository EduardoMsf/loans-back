import { Injectable, NotFoundException } from '@nestjs/common'
import type { PrismaService } from '@prisma-service/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        rfc: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    })

    if (!user) throw new NotFoundException('Usuario no encontrado')

    return user
  }

  async update(
    id: string,
    data: { name?: string; rfc?: string; phone?: string; address?: string },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, rfc: true, phone: true, address: true },
    })
  }
}
