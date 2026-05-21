"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ContractsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ContractsService = ContractsService_1 = class ContractsService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(ContractsService_1.name);
    }
    async findAllByUser(userId) {
        return this.prisma.contract.findMany({
            where: { userId },
            include: {
                product: { select: { name: true, type: true, icon: true } },
                debitAccount: { select: { label: true, lastFour: true } },
                creditAccount: { select: { label: true, lastFour: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id, userId) {
        const contract = await this.prisma.contract.findUnique({
            where: { id },
            include: {
                product: true,
                debitAccount: true,
                creditAccount: true,
            },
        });
        if (!contract)
            throw new common_1.NotFoundException('Contrato no encontrado');
        if (contract.userId !== userId)
            throw new common_1.ForbiddenException('Acceso denegado');
        return contract;
    }
    async create(userId, dto) {
        this.validateSignatureToken(dto.signatureToken, userId);
        const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
        if (!product)
            throw new common_1.NotFoundException('Producto no encontrado');
        const [debitAccount, creditAccount] = await Promise.all([
            this.prisma.account.findFirst({ where: { id: dto.debitAccountId, userId } }),
            this.prisma.account.findFirst({ where: { id: dto.creditAccountId, userId } }),
        ]);
        if (!debitAccount)
            throw new common_1.BadRequestException('Cuenta de cargo inválida');
        if (!creditAccount)
            throw new common_1.BadRequestException('Cuenta de abono inválida');
        const folio = await this.generateFolio();
        const contract = await this.prisma.contract.create({
            data: {
                folio,
                userId,
                productId: dto.productId,
                debitAccountId: dto.debitAccountId,
                creditAccountId: dto.creditAccountId,
                status: client_1.ContractStatus.ACTIVE,
                amount: dto.amount,
                currency: product.currency,
                signedAt: new Date(),
                clientInfo: dto.clientInfo,
            },
            include: {
                product: { select: { name: true, type: true } },
            },
        });
        this.logger.log(`Contract created: ${contract.folio} for user ${userId}`);
        return contract;
    }
    validateSignatureToken(token, expectedUserId) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.getOrThrow('JWT_SIGNATURE_SECRET'),
            });
            if (payload.purpose !== 'contract_sign') {
                throw new common_1.BadRequestException('Token de firma inválido');
            }
            if (payload.sub !== expectedUserId) {
                throw new common_1.ForbiddenException('Token de firma no corresponde al usuario');
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Token de firma expirado o inválido');
        }
    }
    async generateFolio() {
        const year = new Date().getFullYear();
        const count = await this.prisma.contract.count();
        return `FLX-${year}-${String(count + 1).padStart(3, '0')}`;
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = ContractsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map