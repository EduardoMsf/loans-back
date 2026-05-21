import { DashboardService } from './dashboard.service';
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
