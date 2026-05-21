import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@prisma-service/prisma.service'

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } })

    if (!product) throw new NotFoundException('Producto no encontrado')

    return product
  }
}
