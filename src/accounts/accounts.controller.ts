import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AccountsService } from './accounts.service'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { CurrentUser, type JwtPayload } from '@common/decorators/current-user.decorator'

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar cuentas del usuario autenticado' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.accountsService.findAllByUser(user.sub)
  }
}
