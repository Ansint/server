import { Inject, Injectable } from '@nestjs/common';
import { ProviderOptionsSymbol, TypeOptions } from './provider.constans';
import { BaseOAuthService } from './service/base-oauth.service';

@Injectable()
export class ProviderService {
    public constructor( @Inject(ProviderOptionsSymbol) private readonly options: TypeOptions) {}
    
    public onModuleInit() {
        for(const provider of this.options.services){
            provider.BaseUrl = this.options.baseUrl;
        }
    }
    public findByService(service: string): BaseOAuthService | null {
        return this.options.services.find((provider) => provider.name === service) || null;
    }
}

