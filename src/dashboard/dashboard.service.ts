import { Injectable } from '@nestjs/common'
import type { PrismaService } from '@prisma-service/prisma.service'
import { ContractStatus } from '@prisma/client'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string) {
    const [contracts, activeContracts] = await Promise.all([
      this.prisma.contract.count({ where: { userId } }),
      this.prisma.contract.findMany({
        where: { userId, status: ContractStatus.ACTIVE },
        include: {
          product: { select: { name: true, type: true, annualReturn: true, icon: true } },
        },
      }),
    ])

    const totalInvested = activeContracts.reduce((sum, c) => sum + Number(c.amount), 0)

    const avgReturn =
      activeContracts.length > 0
        ? activeContracts.reduce((sum, c) => sum + Number(c.product.annualReturn), 0) /
          activeContracts.length
        : 0

    return {
      totalContracts: contracts,
      activeContracts: activeContracts.length,
      totalInvested,
      avgAnnualReturn: parseFloat(avgReturn.toFixed(2)),
      activeContractsList: activeContracts,
    }
  }
}
