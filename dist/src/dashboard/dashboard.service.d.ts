import { PrismaService } from "../prisma/prisma.service";
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
                type: import("@prisma/client").$Enums.ProductType;
                name: string;
                annualReturn: import("@prisma/client/runtime/client").Decimal;
                icon: string;
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
        })[];
    }>;
}
