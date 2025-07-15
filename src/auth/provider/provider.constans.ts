import { FactoryProvider, ModuleMetadata, Type } from "@nestjs/common";
import { BaseOAuthService } from "./service/base-oauth.service";

export const ProviderOptionsSymbol = Symbol()

export type TypeOptions = {
    baseUrl: string
    services: BaseOAuthService[]
}
export type TypeAsyncOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider<TypeOptions>, 'useFactory' | 'inject'>