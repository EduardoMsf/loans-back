import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from "../../redis/redis.service";
import type { JwtPayload } from "../../common/decorators/current-user.decorator";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly redisService;
    constructor(configService: ConfigService, redisService: RedisService);
    validate(payload: JwtPayload): Promise<JwtPayload>;
}
export {};
