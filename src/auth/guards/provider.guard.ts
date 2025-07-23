import { Request } from "express";
import { ProviderService } from "../provider/provider.service";
import { CanActivate, ConflictException, ExecutionContext, Injectable } from "@nestjs/common";


@Injectable()
export class AuthProviderGuard implements CanActivate {
    public constructor(protected readonly providerService: ProviderService) {}

    public canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest() as Request;
        const provider = request.params.provider;
        const providerInstance = this.providerService.findByService(provider);
        if (!providerInstance) {
            throw new ConflictException('Provider not found');
        }
        return true;
    }
}