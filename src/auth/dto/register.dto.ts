import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'Ana García' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string

  @ApiProperty({ example: 'ana.garcia@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string
}
