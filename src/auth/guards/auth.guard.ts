
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '@prisma/__generated__';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/role.decorator';
import { UserService } from '@/user/user.service';
import { Request } from 'express';

// Extend Express Request interface to include 'user'
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userService:UserService ) {}
   
    public async canActivate(context: ExecutionContext): Promise<boolean> {
    
       
        
        const request = context.switchToHttp().getRequest() as Request;
        if(typeof request.session.userId !== 'number') {
            throw new UnauthorizedException('User not authenticated');
            }
        const user = await this.userService.findById(request.session.userId.toString());
        if (user == null) {
            throw new UnauthorizedException('User not found');
        }
        request.user = user;
        return true;
  }
}
