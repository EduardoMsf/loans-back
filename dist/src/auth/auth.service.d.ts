import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { ReAuthDto } from './dto/re-auth.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly redisService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, redisService: RedisService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        _devToken?: undefined;
    } | {
        message: string;
        _devToken: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    reAuthenticate(dto: ReAuthDto): Promise<{
        signatureToken: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
}
