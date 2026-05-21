import { IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ForgotPasswordDto {
  @ApiProperty({ example: 'ana.garcia@example.com' })
  @IsEmail()
  email: string
}
