import type { DashboardService } from './dashboard.service';
import { type JwtPayload } from "../common/decorators/current-user.decorator";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(user: JwtPayload): Promise<{
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
