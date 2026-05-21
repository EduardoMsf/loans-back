import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ContractsController } from './contracts.controller'
import { ContractsService } from './contracts.service'

@Module({
  imports: [JwtModule.register({})],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
