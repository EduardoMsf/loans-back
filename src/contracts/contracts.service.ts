import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@prisma-service/prisma.service'
import { ContractStatus } from '@prisma/client'
import { CreateContractDto } from './dto/create-contract.dto'

@Injectable()
export class ContractsService {
  private readonly logger = new Logger(ContractsService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findAllByUser(userId: string) {
    return this.prisma.contract.findMany({
      where: { userId },
      include: {
        product: { select: { name: true, type: true, icon: true } },
        debitAccount: { select: { label: true, lastFour: true } },
        creditAccount: { select: { label: true, lastFour: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        product: true,
        debitAccount: true,
        creditAccount: true,
      },
    })

    if (!contract) throw new NotFoundException('Contrato no encontrado')

    if (contract.userId !== userId) throw new ForbiddenException('Acceso denegado')

    return contract
  }

  async create(userId: string, dto: CreateContractDto) {
    this.validateSignatureToken(dto.signatureToken, userId)

    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } })

    if (!product) throw new NotFoundException('Producto no encontrado')

    const [debitAccount, creditAccount] = await Promise.all([
      this.prisma.account.findFirst({ where: { id: dto.debitAccountId, userId } }),
      this.prisma.account.findFirst({ where: { id: dto.creditAccountId, userId } }),
    ])

    if (!debitAccount) throw new BadRequestException('Cuenta de cargo inválida')

    if (!creditAccount) throw new BadRequestException('Cuenta de abono inválida')

    const folio = await this.generateFolio()

    const contract = await this.prisma.contract.create({
      data: {
        folio,
        userId,
        productId: dto.productId,
        debitAccountId: dto.debitAccountId,
        creditAccountId: dto.creditAccountId,
        status: ContractStatus.ACTIVE,
        amount: dto.amount,
        currency: product.currency,
        signedAt: new Date(),
        clientInfo: dto.clientInfo as object,
      },
      include: {
        product: { select: { name: true, type: true } },
      },
    })

    this.logger.log(`Contract created: ${contract.folio} for user ${userId}`)

    return contract
  }

  private validateSignatureToken(token: string, expectedUserId: string) {
    try {
      const payload = this.jwtService.verify<{
        sub: string
        purpose: string
      }>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SIGNATURE_SECRET'),
      })

      if (payload.purpose !== 'contract_sign') {
        throw new BadRequestException('Token de firma inválido')
      }

      if (payload.sub !== expectedUserId) {
        throw new ForbiddenException('Token de firma no corresponde al usuario')
      }
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ForbiddenException) {
        throw error
      }

      throw new BadRequestException('Token de firma expirado o inválido')
    }
  }

  private async generateFolio(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.prisma.contract.count()
    return `FLX-${year}-${String(count + 1).padStart(3, '0')}`
  }
}
