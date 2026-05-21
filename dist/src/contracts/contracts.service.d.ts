import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from "../prisma/prisma.service";
import { CreateContractDto } from './dto/create-contract.dto';
export declare class ContractsService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    findAllByUser(userId: string): Promise<({
        product: {
            type: import("@prisma/client").$Enums.ProductType;
            name: string;
            icon: string;
        };
        debitAccount: {
            label: string;
            lastFour: string;
        };
        creditAccount: {
            label: string;
            lastFour: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
        productId: string;
        debitAccountId: string;
        creditAccountId: string;
        amount: import("@prisma/client/runtime/client").Decimal;
        clientInfo: import("@prisma/client/runtime/client").JsonValue;
        folio: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        signedAt: Date | null;
    })[]>;
    findById(id: string, userId: string): Promise<{
        product: {
            type: import("@prisma/client").$Enums.ProductType;
            description: string;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            minAmount: import("@prisma/client/runtime/client").Decimal;
            currency: string;
            annualReturn: import("@prisma/client/runtime/client").Decimal;
            riskLevel: import("@prisma/client").$Enums.RiskLevel;
            icon: string;
            isActive: boolean;
        };
        debitAccount: {
            type: import("@prisma/client").$Enums.AccountType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            isActive: boolean;
            userId: string;
            label: string;
            bank: string;
            clabe: string;
            lastFour: string;
            balance: import("@prisma/client/runtime/client").Decimal;
        };
        creditAccount: {
            type: import("@prisma/client").$Enums.AccountType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            isActive: boolean;
            userId: string;
            label: string;
            bank: string;
            clabe: string;
            lastFour: string;
            balance: import("@prisma/client/runtime/client").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
        productId: string;
        debitAccountId: string;
        creditAccountId: string;
        amount: import("@prisma/client/runtime/client").Decimal;
        clientInfo: import("@prisma/client/runtime/client").JsonValue;
        folio: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        signedAt: Date | null;
    }>;
    create(userId: string, dto: CreateContractDto): Promise<{
        product: {
            type: import("@prisma/client").$Enums.ProductType;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
        productId: string;
        debitAccountId: string;
        creditAccountId: string;
        amount: import("@prisma/client/runtime/client").Decimal;
        clientInfo: import("@prisma/client/runtime/client").JsonValue;
        folio: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        signedAt: Date | null;
    }>;
    private validateSignatureToken;
    private generateFolio;
}
