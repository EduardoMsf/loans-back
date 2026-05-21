import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface StandardResponse<T> {
  success: boolean
  data: T
  meta?: Record<string, unknown>
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'data' in data) {
          return { success: true, ...data }
        }

        return { success: true, data }
      }),
    )
  }
}
