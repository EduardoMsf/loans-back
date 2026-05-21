import { Test, type TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}

const mockRedis = {
  isTokenBlacklisted: jest.fn().mockResolvedValue(false),
  setResetToken: jest.fn(),
  getResetToken: jest.fn(),
  delResetToken: jest.fn(),
}

const mockJwt = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn(),
}

const mockConfig = {
  get: jest.fn().mockReturnValue('test-value'),
  getOrThrow: jest.fn().mockReturnValue('test-secret'),
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)

    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      await expect(service.login({ email: 'notfound@test.com', password: 'pass' })).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })

  describe('register', () => {
    it('should throw ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'exists@test.com' })

      await expect(
        service.register({ name: 'Test', email: 'exists@test.com', password: 'password' }),
      ).rejects.toThrow(ConflictException)
    })
  })
})
