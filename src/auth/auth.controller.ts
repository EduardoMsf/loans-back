import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import type { AuthService } from './auth.service'
import type { LoginDto } from './dto/login.dto'
import type { RegisterDto } from './dto/register.dto'
import type { ForgotPasswordDto } from './dto/forgot-password.dto'
import type { ResetPasswordDto } from './dto/reset-password.dto'
import type { ReAuthDto } from './dto/re-auth.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna tokens JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar restablecimiento de contraseña' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restablecer contraseña con token' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password)
  }

  @Post('re-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Re-autenticación para firma de contratos (2FA simulado)' })
  @ApiResponse({ status: 200, description: 'Retorna signatureToken JWT de corta duración' })
  reAuth(@Body() dto: ReAuthDto) {
    return this.authService.reAuthenticate(dto)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token con refresh token' })
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken)
  }
}
