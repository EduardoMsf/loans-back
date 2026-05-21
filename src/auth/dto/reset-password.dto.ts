import { IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token recibido por email' })
  @IsString()
  token: string

  @ApiProperty({ example: 'NuevaPassword123!' })
  @IsString()
  @MinLength(8)
  password: string
}
