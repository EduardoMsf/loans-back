import { IsString, IsNumber, IsObject, ValidateNested, IsEmail, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

class ClientInfoDto {
  @IsString() fullName: string
  @IsString() rfc: string
  @IsString() phone: string
  @IsEmail() email: string
  @IsString() address: string
  @IsString() investmentPurpose: string
}

export class CreateContractDto {
  @ApiProperty()
  @IsString()
  productId: string

  @ApiProperty()
  @IsString()
  debitAccountId: string

  @ApiProperty()
  @IsString()
  creditAccountId: string

  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => ClientInfoDto)
  clientInfo: ClientInfoDto

  @ApiProperty({ description: 'JWT de firma generado por /auth/re-auth' })
  @IsString()
  signatureToken: string
}
