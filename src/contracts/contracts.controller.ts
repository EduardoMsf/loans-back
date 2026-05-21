import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ContractsService } from './contracts.service'
import { CreateContractDto } from './dto/create-contract.dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { CurrentUser, type JwtPayload } from '@common/decorators/current-user.decorator'

@ApiTags('Contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar contratos del usuario autenticado' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.contractsService.findAllByUser(user.sub)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de contrato' })
  findById(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.contractsService.findById(id, user.sub)
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva solicitud de contratación (requiere signatureToken)' })
  create(@Body() dto: CreateContractDto, @CurrentUser() user: JwtPayload) {
    return this.contractsService.create(user.sub, dto)
  }
}
