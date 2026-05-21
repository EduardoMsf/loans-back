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
    // 1. CETES 364 días (Renta Fija - Bajo Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-005' },
      update: {},
      create: {
        id: 'prod-005',
        name: 'CETES 1 Año',
        type: ProductType.FIXED_INCOME,
        description: 'Certificados de la Tesorería de la Federación a plazo de un año',
        minAmount: 100,
        currency: 'MXN',
        annualReturn: 11.25,
        riskLevel: RiskLevel.LOW,
        icon: '🏛️',
      },
    }),

    // 2. Nu México - Cajita (Renta Fija / Sofipo - Bajo Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-006' },
      update: {},
      create: {
        id: 'prod-006',
        name: 'Cuenta Nu (Cajita)',
        type: ProductType.FIXED_INCOME,
        description: 'Cuenta de ahorro con rendimiento diario y disponibilidad inmediata',
        minAmount: 1,
        currency: 'MXN',
        annualReturn: 14.75,
        riskLevel: RiskLevel.LOW,
        icon: '💜',
      },
    }),

    // 3. Finsus - Plazo Fijo 1 Año (Sofipo - Bajo/Medio Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-007' },
      update: {},
      create: {
        id: 'prod-007',
        name: 'Finsus 360 días',
        type: ProductType.FIXED_INCOME,
        description:
          'Inversión a plazo fijo en Financiera Sustentable con pago de rendimientos mensual',
        minAmount: 100,
        currency: 'MXN',
        annualReturn: 15.01,
        riskLevel: RiskLevel.LOW,
        icon: '📱',
      },
    }),

    // 4. ETF IVV (Renta Variable / Acciones - Medio/Alto Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-008' },
      update: {},
      create: {
        id: 'prod-008',
        name: 'ETF iShares Core S&P 500',
        type: ProductType.FUND,
        description:
          'Fondo que replica las 500 empresas más grandes de EE.UU. (Histórico prom. 10%)',
        minAmount: 9500,
        currency: 'MXN',
        annualReturn: 10.5,
        riskLevel: RiskLevel.MEDIUM,
        icon: '📈',
      },
    }),

    // 5. ETF QQQ (Renta Variable / Tecnológicas - Alto Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-009' },
      update: {},
      create: {
        id: 'prod-009',
        name: 'ETF Invesco QQQ',
        type: ProductType.FUND,
        description: 'Fondo que sigue al índice Nasdaq-100, enfocado en tecnología e innovación',
        minAmount: 8500,
        currency: 'MXN',
        annualReturn: 14.2,
        riskLevel: RiskLevel.HIGH,
        icon: '🚀',
      },
    }),

    // 6. UDIBONOS 3 años (Renta Fija protegida de inflación - Bajo Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-010' },
      update: {},
      create: {
        id: 'prod-010',
        name: 'UDIBONOS 3 Años',
        type: ProductType.FIXED_INCOME,
        description: 'Instrumentos del gobierno federal que pagan intereses cada 6 meses en UDIS',
        minAmount: 100,
        currency: 'MXN',
        annualReturn: 5.3, // Más el ajuste inflacionario real
        riskLevel: RiskLevel.LOW,
        icon: '🛡️',
      },
    }),

    // 7. Funo (Fibra Uno) - Bienes Raíces (Renta Variable - Medio Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-011' },
      update: {},
      create: {
        id: 'prod-011',
        name: 'Fibra Uno (FUNO11)',
        type: ProductType.FUND,
        description:
          'Fideicomiso de inversión en bienes raíces industriales, comerciales y de oficinas',
        minAmount: 30,
        currency: 'MXN',
        annualReturn: 8.5, // Rendimiento por distribución de dividendos estimado
        riskLevel: RiskLevel.MEDIUM,
        icon: '🏢',
      },
    }),

    // 8. Bitcoin via Bitso (Cripto - Alto Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-012' },
      update: {},
      create: {
        id: 'prod-012',
        name: 'Bitcoin (BTC)',
        type: ProductType.FUND,
        description: 'Compra directa de la principal criptomoneda del mercado',
        minAmount: 10,
        currency: 'MXN',
        annualReturn: 35.0, // Altamente volátil, representa una estimación / promedio de riesgo
        riskLevel: RiskLevel.HIGH,
        icon: '🪙',
      },
    }),

    // 9. Mercado Pago - Mercado Fondo (Renta Fija / Liquidez - Bajo Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-013' },
      update: {},
      create: {
        id: 'prod-013',
        name: 'Mercado Fondo (GBM)',
        type: ProductType.FIXED_INCOME,
        description:
          'Fondo de inversión de bajo riesgo administrado por GBM con disponibilidad diaria',
        minAmount: 1,
        currency: 'MXN',
        annualReturn: 10.2,
        riskLevel: RiskLevel.LOW,
        icon: '🤝',
      },
    }),

    // 10. Fondo de Estrategia Global - Dólares (Renta Variable - Medio/Alto Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-014' },
      update: {},
      create: {
        id: 'prod-014',
        name: 'Fondo Corp. Dólares (GBMTRV)',
        type: ProductType.FUND,
        description: 'Fondo de renta variable internacional denominado en dólares estadounidenses',
        minAmount: 1000,
        currency: 'USD',
        annualReturn: 9.0,
        riskLevel: RiskLevel.MEDIUM,
        icon: '💵',
      },
    }),

    // 11. Acción AMX (EQUITY - Alto Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-015' },
      update: {},
      create: {
        id: 'prod-015',
        name: 'Acción AMX (América Móvil)',
        type: ProductType.EQUITY,
        description:
          'Acción de la principal empresa de telecomunicaciones de Latinoamérica, listada en BMV',
        minAmount: 500,
        currency: 'MXN',
        annualReturn: 9.8,
        riskLevel: RiskLevel.HIGH,
        icon: '📡',
      },
    }),

    // 12. Acción WALMEX (EQUITY - Medio Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-016' },
      update: {},
      create: {
        id: 'prod-016',
        name: 'Acción WALMEX (Walmart de México)',
        type: ProductType.EQUITY,
        description: 'Acción de la cadena de tiendas de autoservicio más grande de México',
        minAmount: 1000,
        currency: 'MXN',
        annualReturn: 8.1,
        riskLevel: RiskLevel.MEDIUM,
        icon: '🛒',
      },
    }),

    // 13. Acción CEMEX (EQUITY - Alto Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-017' },
      update: {},
      create: {
        id: 'prod-017',
        name: 'Acción CEMEX',
        type: ProductType.EQUITY,
        description: 'Acción de la empresa cementera global con presencia en más de 50 países',
        minAmount: 200,
        currency: 'MXN',
        annualReturn: 11.4,
        riskLevel: RiskLevel.HIGH,
        icon: '🏗️',
      },
    }),

    // 14. Divisa GBP (FOREX - Bajo Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-018' },
      update: {},
      create: {
        id: 'prod-018',
        name: 'Divisa GBP',
        type: ProductType.FOREX,
        description: 'Compra-venta de libras esterlinas, moneda oficial del Reino Unido',
        minAmount: 1000,
        currency: 'GBP',
        annualReturn: 3.2,
        riskLevel: RiskLevel.LOW,
        icon: '🇬🇧',
      },
    }),

    // 15. Bonos M 5 Años (Renta Fija Gubernamental - Bajo Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-019' },
      update: {},
      create: {
        id: 'prod-019',
        name: 'Bonos M 5 Años',
        type: ProductType.FIXED_INCOME,
        description:
          'Bonos de tasa fija emitidos por el gobierno federal mexicano a plazo de 5 años',
        minAmount: 100,
        currency: 'MXN',
        annualReturn: 10.9,
        riskLevel: RiskLevel.LOW,
        icon: '🏛️',
      },
    }),

    // 16. Fondo de Deuda Corporativa (Renta Fija - Medio Riesgo)
    prisma.product.upsert({
      where: { id: 'prod-020' },
      update: {},
      create: {
        id: 'prod-020',
        name: 'Fondo Deuda Corporativa',
        type: ProductType.FIXED_INCOME,
        description:
          'Fondo que invierte en bonos emitidos por empresas privadas mexicanas de alta calidad crediticia',
        minAmount: 5000,
        currency: 'MXN',
        annualReturn: 13.5,
        riskLevel: RiskLevel.MEDIUM,
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
