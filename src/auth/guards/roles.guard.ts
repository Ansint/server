
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '@prisma/__generated__';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}
   
    public async canActivate(context: ExecutionContext): Promise<boolean> {
    
        const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        
        const request = context.switchToHttp().getRequest();
        if (!roles || roles.length === 0) {
            return true; // No roles required, allow access
        }
        if (!roles.includes(request.user.role)) {
            throw new ForbiddenException('not acess'); // If the user is not a USER, deny access
        }
        return true;
  }
}
