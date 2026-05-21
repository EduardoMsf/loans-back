import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

export interface JwtPayload {
  sub: string
  email: string
  name: string
  jti: string
  iat: number
  exp: number
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>()
    return request.user
  },
)
