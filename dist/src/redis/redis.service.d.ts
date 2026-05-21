import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private client;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): Promise<void>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    blacklistToken(jti: string, ttlSeconds: number): Promise<void>;
    isTokenBlacklisted(jti: string): Promise<boolean>;
    setResetToken(token: string, userId: string, ttlSeconds: number): Promise<void>;
    getResetToken(token: string): Promise<string | null>;
    delResetToken(token: string): Promise<void>;
}
