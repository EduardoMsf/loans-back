import type { PrismaService } from "../prisma/prisma.service";
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSummary(userId: string): Promise<{
        totalContracts: number;
        activeContracts: number;
        totalInvested: number;
        avgAnnualReturn: number;
        activeContractsList: ({
            product: {
                name: string;
                type: import("@prisma/client").$Enums.ProductType;
                annualReturn: import("@prisma/client/runtime/client").Decimal;
                icon: string;
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
        })[];
    }>;
}
