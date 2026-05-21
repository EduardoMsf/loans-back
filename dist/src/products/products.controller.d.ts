import type { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<{
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
    }[]>;
    findById(id: string): Promise<{
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
    }>;
}
