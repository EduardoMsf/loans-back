export interface JwtPayload {
    sub: string;
    email: string;
    name: string;
    jti: string;
    iat: number;
    exp: number;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
