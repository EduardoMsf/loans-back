import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@prisma-service/prisma.service'
import { RedisService } from '@redis-service/redis.service'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { ReAuthDto } from './dto/re-auth.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })

    if (!user) throw new UnauthorizedException('Credenciales inválidas')

    const passwordMatch = await bcrypt.compare(dto.password, user.password)

    if (!passwordMatch) throw new UnauthorizedException('Credenciales inválidas')

    return this.generateTokens(user.id, user.email, user.name)
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })

    if (exists) throw new ConflictException('El email ya está registrado')

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email, password: hashedPassword },
    })

    this.logger.log(`New user registered: ${user.email}`)

    return { message: 'Usuario creado exitosamente' }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) {
      this.logger.warn(`Forgot password request for unknown email: ${email}`)
      return { message: 'Si el email existe, recibirás instrucciones' }
    }

    const token = uuidv4()
    const ttl = this.configService.get<number>('RESET_TOKEN_TTL', 900)

    await this.redisService.setResetToken(token, user.id, ttl)

    this.logger.log(`Password reset token for ${email}: ${token}`)

    return { message: 'Si el email existe, recibirás instrucciones', _devToken: token }
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this.redisService.getResetToken(token)

    if (!userId) throw new BadRequestException('Token inválido o expirado')

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    await this.redisService.delResetToken(token)

    return { message: 'Contraseña actualizada exitosamente' }
  }

  async reAuthenticate(dto: ReAuthDto): Promise<{ signatureToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })

    if (!user) throw new UnauthorizedException('Credenciales inválidas')

    const passwordMatch = await bcrypt.compare(dto.password, user.password)

    if (!passwordMatch) throw new UnauthorizedException('Credenciales inválidas')

    const signatureToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        purpose: 'contract_sign',
        jti: uuidv4(),
      },
      {
        secret: this.configService.getOrThrow<string>('JWT_SIGNATURE_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_SIGNATURE_EXPIRES_IN',
          '5m',
        ) as unknown as number,
      },
    )

    return { signatureToken }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{
        sub: string
        email: string
        name: string
        jti: string
      }>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      })

      const isBlacklisted = await this.redisService.isTokenBlacklisted(payload.jti)

      if (isBlacklisted) throw new UnauthorizedException('Token revocado')

      return this.generateTokens(payload.sub, payload.email, payload.name)
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado')
    }
  }

  private generateTokens(userId: string, email: string, name: string) {
    const jti = uuidv4()
    const refreshJti = uuidv4()

    const accessToken = this.jwtService.sign(
      { sub: userId, email, name, jti },
      {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m') as unknown as number,
      },
    )

    const refreshToken = this.jwtService.sign(
      { sub: userId, email, name, jti: refreshJti },
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ) as unknown as number,
      },
    )

    return { accessToken, refreshToken }
  }
}
