import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { $Enums, AuthMethod, User } from '@prisma/__generated__';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {

    public constructor(private readonly userService: UserService,private readonly configService: ConfigService) {}
    public async register (req: Request, dto: RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email);
        if (isExists) {
            throw new ConflictException('Email already exists');
        }
        const newUser = await this.userService.createUser(dto.email, dto.password, dto.name, '', AuthMethod.CREDENTIALS, false);
        return this.saveSession(req, newUser);
    }

    public async login (req: Request, dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);

        if (!user) {
            throw new ConflictException('User not found');
        }
        const isPasswordValid = await verify(user.password, dto.password);
        if (!isPasswordValid) {
            throw new ConflictException('Invalid password');
        }
        return this.saveSession(req, user);
    }
    public async logout (req: Request, response: Response) {
        return new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    return reject(new InternalServerErrorException('Failed to destroy session'));
                }
                response.clearCookie(this.configService.getOrThrow('SESSION_NAME'), {
                    domain: this.configService.getOrThrow('SESSION_DOMAIN'),
                    httpOnly: this.configService.getOrThrow('SESSION_HTTP_ONLY'),
                    secure: this.configService.getOrThrow('SESSION_SECURE'),
                    sameSite: 'lax',
                });
                resolve({ message: 'Logged out successfully' });
            });
        });
        
    }

    private async saveSession (req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = Number(user.id);
            req.session.save((err) => {
                if (err) {
                    return reject(err);
                }
                resolve(user);
            });
        });
    }
}