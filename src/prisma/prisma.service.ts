import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    const connectionString = process.env.DATABASE_URL!
    const isRemote =
      !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1')
    const pool = new Pool({
      connectionString,
      ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
    })
    const adapter = new PrismaPg(pool)
    super({ adapter })
  }

  async onModuleInit() {
    await this.$connect()
    this.logger.log('Connected to PostgreSQL via Prisma')
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log('Disconnected from PostgreSQL')
  }
}
