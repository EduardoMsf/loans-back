import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import type { ProductsService } from './products.service'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los productos activos' })
  findAll() {
    return this.productsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  findById(@Param('id') id: string) {
    return this.productsService.findById(id)
  }
}
