import { BadRequestException, Body, ConflictException, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { AuthProviderGuard } from './guards/provider.guard';
import { ProviderService } from './provider/provider.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly providerService: ProviderService // добавьте это
  ) {}

  @Recaptcha()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async registerUser(@Req() req, @Body() dto: RegisterDto) {
    return this.authService.register(req, dto);
  }
  @Get('/oaut/callback/:provider')
  @UseGuards(AuthProviderGuard)
  public async callBack(@Req() req:Request,@Res({passthrough:true}) res: Response,@Query('code') code: string,@Param('provider') provider: string){
    if (!code) {
      throw new BadRequestException('Code is required');
    }
    await this.authService.extractProfileFromCode(req, code, provider);
    return res.redirect(`${this.configService.getOrThrow<string>('ALLOW_ORIGIN')}/dashboard/settings}`);
  }

  @Recaptcha()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async loginUser(@Req() req, @Body() dto: LoginDto) {
    return this.authService.login(req, dto);
  }
  @UseGuards(AuthProviderGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/oaut/connect/:provider')
  public async connect(@Param('provider') provider: string){
    const providerInstance = this.providerService.findByService(provider); // используйте providerService
    if (!providerInstance) {
      throw new ConflictException('Provider not found');
    }
    return {
      url: providerInstance.getAuthUrl(),
    }
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Req() req, @Res({ passthrough: true }) response) {
    return this.authService.logout(req, response);
  }
}
