import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AuthMethod } from '@prisma/__generated__';
import { hash } from 'argon2';

@Injectable()
export class UserService {
    public constructor(private readonly prismaService: PrismaService) {}

        public async findById(id: string) {
            return this.prismaService.user.findUnique({
                where: { id },
                include: { accounts: true },
            });
        }

        public async findByEmail(email:string) {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email
                },
                include : {
                 accounts: true,
                },
        });
            return user;
        }
    
        public async createUser(email:string,password:string,displayName:string,picture:string,method:AuthMethod,isEmailVerified:boolean) {
            const user = await this.prismaService.user.create({
                data: {
                    email,
                    password: password ? await hash(password) : '',
                    displayName,
                    picture,
                    method,
                    isEmailVerified
                },
                include: {
                    accounts: true,
                },
        })
            return user;
        }
}
