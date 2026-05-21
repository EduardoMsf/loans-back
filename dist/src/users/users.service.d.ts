import { PrismaService } from "../prisma/prisma.service";
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        rfc: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
    }>;
    update(id: string, data: {
        name?: string;
        rfc?: string;
        phone?: string;
        address?: string;
    }): Promise<{
        email: string;
        name: string;
        id: string;
        rfc: string | null;
        phone: string | null;
        address: string | null;
    }>;
}
