import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<{
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
    }[]>;
    findById(id: string): Promise<{
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
    }>;
}
