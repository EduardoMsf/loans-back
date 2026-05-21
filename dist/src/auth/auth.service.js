"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService, redisService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.redisService = redisService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        return this.generateTokens(user.id, user.email, user.name);
    }
    async register(dto) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists)
            throw new common_1.ConflictException('El email ya está registrado');
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: { name: dto.name, email: dto.email, password: hashedPassword },
        });
        this.logger.log(`New user registered: ${user.email}`);
        return { message: 'Usuario creado exitosamente' };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            this.logger.warn(`Forgot password request for unknown email: ${email}`);
            return { message: 'Si el email existe, recibirás instrucciones' };
        }
        const token = (0, uuid_1.v4)();
        const ttl = this.configService.get('RESET_TOKEN_TTL', 900);
        await this.redisService.setResetToken(token, user.id, ttl);
        this.logger.log(`Password reset token for ${email}: ${token}`);
        return { message: 'Si el email existe, recibirás instrucciones', _devToken: token };
    }
    async resetPassword(token, newPassword) {
        const userId = await this.redisService.getResetToken(token);
        if (!userId)
            throw new common_1.BadRequestException('Token inválido o expirado');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        await this.redisService.delResetToken(token);
        return { message: 'Contraseña actualizada exitosamente' };
    }
    async reAuthenticate(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const signatureToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            purpose: 'contract_sign',
            jti: (0, uuid_1.v4)(),
        }, {
            secret: this.configService.getOrThrow('JWT_SIGNATURE_SECRET'),
            expiresIn: this.configService.get('JWT_SIGNATURE_EXPIRES_IN', '5m'),
        });
        return { signatureToken };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            });
            const isBlacklisted = await this.redisService.isTokenBlacklisted(payload.jti);
            if (isBlacklisted)
                throw new common_1.UnauthorizedException('Token revocado');
            return this.generateTokens(payload.sub, payload.email, payload.name);
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token inválido o expirado');
        }
    }
    generateTokens(userId, email, name) {
        const jti = (0, uuid_1.v4)();
        const refreshJti = (0, uuid_1.v4)();
        const accessToken = this.jwtService.sign({ sub: userId, email, name, jti }, {
            secret: this.configService.getOrThrow('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
        });
        const refreshToken = this.jwtService.sign({ sub: userId, email, name, jti: refreshJti }, {
            secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        });
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function, Function, Function])
], AuthService);
//# sourceMappingURL=auth.service.js.map