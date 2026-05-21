import type { PrismaService } from "../prisma/prisma.service";
export declare class AccountsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllByUser(userId: string): Promise<{
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
    }[]>;
}
