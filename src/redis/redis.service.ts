import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis
  private readonly logger = new Logger(RedisService.name)

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const url = this.configService.get<string>('REDIS_URL')
    this.client = url
      ? new Redis(url, {
          lazyConnect: true,
          ...(url.startsWith('rediss://') ? { tls: { rejectUnauthorized: false } } : {}),
        })
      : new Redis({
          host: this.configService.get<string>('REDIS_HOST', 'localhost'),
          port: this.configService.get<number>('REDIS_PORT', 6379),
          password: this.configService.get<string>('REDIS_PASSWORD'),
          lazyConnect: true,
        })

    this.client.on('connect', () => this.logger.log('Connected to Redis'))
    this.client.on('error', (err) => this.logger.error('Redis error', err))
  }

  async onModuleDestroy() {
    await this.client.quit()
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds)
    } else {
      await this.client.set(key, value)
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key)
    return result === 1
  }

  async blacklistToken(jti: string, ttlSeconds: number): Promise<void> {
    await this.set(`blacklist:${jti}`, '1', ttlSeconds)
  }

  async isTokenBlacklisted(jti: string): Promise<boolean> {
    return this.exists(`blacklist:${jti}`)
  }

  async setResetToken(token: string, userId: string, ttlSeconds: number): Promise<void> {
    await this.set(`reset:${token}`, userId, ttlSeconds)
  }

  async getResetToken(token: string): Promise<string | null> {
    return this.get(`reset:${token}`)
  }

  async delResetToken(token: string): Promise<void> {
    await this.del(`reset:${token}`)
  }
}
