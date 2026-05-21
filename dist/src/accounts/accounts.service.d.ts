import { PrismaService } from "../prisma/prisma.service";
export declare class AccountsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllByUser(userId: string): Promise<{
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
