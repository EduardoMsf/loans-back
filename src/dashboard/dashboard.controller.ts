import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import type { DashboardService } from './dashboard.service'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { CurrentUser, type JwtPayload } from '@common/decorators/current-user.decorator'

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen del dashboard para el usuario autenticado' })
  getSummary(@CurrentUser() user: JwtPayload) {
    return this.dashboardService.getSummary(user.sub)
  }
}
