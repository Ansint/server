import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PassThrough } from 'stream';
import { Recaptcha } from '@nestlab/google-recaptcha';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Recaptcha()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async registerUser(@Req() req, @Body() dto: RegisterDto) {
    return this.authService.register(req, dto);
  }

  @Recaptcha()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async loginUser(@Req() req, @Body() dto: LoginDto) {
    return this.authService.login(req, dto);
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Req() req, @Res({ passthrough: true }) response) {
    return this.authService.logout(req, response);
  }
}
