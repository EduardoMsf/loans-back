import { AccountsService } from './accounts.service';
import { type JwtPayload } from "../common/decorators/current-user.decorator";
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    findAll(user: JwtPayload): Promise<{
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
    }[]>;
}
