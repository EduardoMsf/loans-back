import type { ContractsService } from './contracts.service';
import type { CreateContractDto } from './dto/create-contract.dto';
import { type JwtPayload } from "../common/decorators/current-user.decorator";
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    findAll(user: JwtPayload): Promise<({
        product: {
            name: string;
            type: import("@prisma/client").$Enums.ProductType;
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
        folio: string;
        productId: string;
        debitAccountId: string;
        creditAccountId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        amount: import("@prisma/client/runtime/client").Decimal;
        signedAt: Date | null;
        clientInfo: import("@prisma/client/runtime/client").JsonValue;
    })[]>;
    findById(id: string, user: JwtPayload): Promise<{
        product: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.ProductType;
            description: string;
            minAmount: import("@prisma/client/runtime/client").Decimal;
            currency: string;
            annualReturn: import("@prisma/client/runtime/client").Decimal;
            riskLevel: import("@prisma/client").$Enums.RiskLevel;
            icon: string;
            isActive: boolean;
        };
        debitAccount: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.AccountType;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.AccountType;
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
        folio: string;
        productId: string;
        debitAccountId: string;
        creditAccountId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        amount: import("@prisma/client/runtime/client").Decimal;
        signedAt: Date | null;
        clientInfo: import("@prisma/client/runtime/client").JsonValue;
    }>;
    create(dto: CreateContractDto, user: JwtPayload): Promise<{
        product: {
            name: string;
            type: import("@prisma/client").$Enums.ProductType;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
        folio: string;
        productId: string;
        debitAccountId: string;
        creditAccountId: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        amount: import("@prisma/client/runtime/client").Decimal;
        signedAt: Date | null;
        clientInfo: import("@prisma/client/runtime/client").JsonValue;
    }>;
}
