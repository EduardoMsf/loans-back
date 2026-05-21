import 'dotenv/config'
import { PrismaClient, ProductType, RiskLevel, AccountType, ContractStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  const hashedPassword = await bcrypt.hash('Password123!', 10)

  const user = await prisma.user.upsert({
    where: { email: 'ana.garcia@example.com' },
    update: {},
    create: {
      name: 'Ana García',
      email: 'ana.garcia@example.com',
      password: hashedPassword,
      rfc: 'GAAN850101ABC',
      phone: '+52 55 1234 5678',
      address: 'Av. Reforma 123, CDMX',
    },
  })

  console.log('Usuario creado:', user.email)

  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'prod-001' },
      update: {},
      create: {
        id: 'prod-001',
        name: 'Divisa USD',
        type: ProductType.FOREX,
        description: 'Compra-venta de dólares estadounidenses',
        minAmount: 1000,
        currency: 'USD',
        annualReturn: 4.5,
        riskLevel: RiskLevel.LOW,
        icon: '🇺🇸',
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-002' },
      update: {},
      create: {
        id: 'prod-002',
        name: 'Divisa EUR',
        type: ProductType.FOREX,
        description: 'Compra-venta de euros',
        minAmount: 1000,
        currency: 'EUR',
        annualReturn: 3.8,
        riskLevel: RiskLevel.LOW,
        icon: '🇪🇺',
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-003' },
      update: {},
      create: {
        id: 'prod-003',
        name: 'Fondo de Renta Variable',
        type: ProductType.FUND,
        description: 'Fondo diversificado en acciones del mercado mexicano',
        minAmount: 5000,
        currency: 'MXN',
        annualReturn: 12.3,
        riskLevel: RiskLevel.HIGH,
        icon: '📈',
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-004' },
      update: {},
      create: {
        id: 'prod-004',
        name: 'CETES 28 días',
        type: ProductType.FIXED_INCOME,
        description: 'Certificados de la Tesorería de la Federación',
        minAmount: 100,
        currency: 'MXN',
        annualReturn: 11.1,
        riskLevel: RiskLevel.LOW,
        icon: '🏦',
      },
    }),
  ])

  console.log('Productos creados:', products.length)

  const accounts = await Promise.all([
    prisma.account.upsert({
      where: { clabe: '014180655234567890' },
      update: {},
      create: {
        id: 'acc-001',
        userId: user.id,
        label: 'Cuenta de Cheques Principal',
        bank: 'Banco Nacional',
        clabe: '014180655234567890',
        lastFour: '7890',
        type: AccountType.DEBIT,
        balance: 125000,
        currency: 'MXN',
      },
    }),
    prisma.account.upsert({
      where: { clabe: '014180655234567891' },
      update: {},
      create: {
        id: 'acc-002',
        userId: user.id,
        label: 'Cuenta de Ahorro',
        bank: 'Banco Nacional',
        clabe: '014180655234567891',
        lastFour: '7891',
        type: AccountType.DEBIT,
        balance: 48500,
        currency: 'MXN',
      },
    }),
    prisma.account.upsert({
      where: { clabe: '014180655234567892' },
      update: {},
      create: {
        id: 'acc-003',
        userId: user.id,
        label: 'Cuenta de Inversión USD',
        bank: 'Banco Nacional',
        clabe: '014180655234567892',
        lastFour: '7892',
        type: AccountType.CREDIT,
        balance: 12000,
        currency: 'USD',
      },
    }),
  ])

  console.log('Cuentas creadas:', accounts.length)

  const contracts = await Promise.all([
    prisma.contract.upsert({
      where: { folio: 'FLX-2024-001' },
      update: {},
      create: {
        folio: 'FLX-2024-001',
        userId: user.id,
        productId: products[0]!.id,
        debitAccountId: accounts[0]!.id,
        creditAccountId: accounts[2]!.id,
        status: ContractStatus.ACTIVE,
        amount: 5000,
        currency: 'USD',
        signedAt: new Date('2024-02-10T09:30:00Z'),
        clientInfo: {
          fullName: 'Ana García',
          rfc: 'GAAN850101ABC',
          phone: '+52 55 1234 5678',
          email: 'ana.garcia@example.com',
          address: 'Av. Reforma 123, CDMX',
          investmentPurpose: 'Diversificación de portafolio',
        },
      },
    }),
    prisma.contract.upsert({
      where: { folio: 'FLX-2024-002' },
      update: {},
      create: {
        folio: 'FLX-2024-002',
        userId: user.id,
        productId: products[3]!.id,
        debitAccountId: accounts[1]!.id,
        creditAccountId: accounts[1]!.id,
        status: ContractStatus.ACTIVE,
        amount: 10000,
        currency: 'MXN',
        signedAt: new Date('2024-03-01T11:15:00Z'),
        clientInfo: {
          fullName: 'Ana García',
          rfc: 'GAAN850101ABC',
          phone: '+52 55 1234 5678',
          email: 'ana.garcia@example.com',
          address: 'Av. Reforma 123, CDMX',
          investmentPurpose: 'Ahorro a corto plazo',
        },
      },
    }),
  ])

  console.log('Contratos creados:', contracts.length)
  console.log('Seed completado')
}

main()
  .catch((e) => {
    console.error('Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
