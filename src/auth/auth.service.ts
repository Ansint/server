import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { AuthMethod } from '@prisma/__generated__';
@Injectable()
export class AuthService {

    public constructor(private readonly userService: UserService) {}
    public async register (dto:RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email);
        if (isExists) {
            throw new ConflictException('Email already exists');
        }
        const newUser = await this.userService.createUser(dto.email, dto.password, dto.name,'',AuthMethod.CREDENTIALS,false);
    }

    public async login () {
        
    }
    public async logout () {
        
    }

    private async saveSession () {

    }
}
