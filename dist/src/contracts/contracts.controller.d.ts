import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { type JwtPayload } from "../common/decorators/current-user.decorator";
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    findAll(user: JwtPayload): Promise<({
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
    findById(id: string, user: JwtPayload): Promise<{
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
    create(dto: CreateContractDto, user: JwtPayload): Promise<{
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
}
