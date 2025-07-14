import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { TypeBaseProviderOptions } from "./types/base-provider.options";
import { TypeUserInfo } from "./types/user-info.types";

@Injectable()
export class BaseOAuthService {
    private BASE_URL: string;
    
    
    
    protected async extractUserInfo(data:any): Promise<TypeUserInfo> {
        return {
            ...data,
            provider: this.options.name,
        }
    }
    
    public getAuthUrl(){
        const query = new URLSearchParams({
            response_type: 'code',
            client_id: this.options.client_id,
            redirect_uri: this.getRedirectUrl(),
            scope: (this.options.scopes ?? []).join(' '),
            access_type: 'offline',
            prompt: 'select_account',
        })
        return `${this.options.acess_url}?${query.toString()}`;
    }
    

    public async findUserByCode(code: string): Promise<TypeUserInfo> {
        const client_id = this.options.client_id;
        const client_secret = this.options.client_secret;

        const tokenQuery = new URLSearchParams({
            client_id,
            client_secret,
            code,
            redirect_uri: this.getRedirectUrl(),
            grant_type: 'authorization_code',
        });
        const tokenRequest = await fetch(this.options.acess_url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
                body: tokenQuery.toString(),
            }
        );
        const tokenResponse = await tokenRequest.json();

        if (!tokenRequest.ok) {
            throw new BadRequestException(`Failed to get access token: ${tokenResponse.error || 'Unknown error'}`);
        }
        if (!tokenResponse.access_token) {
            throw new BadRequestException('Access token not found in response');
        }

        const userRequest = await fetch(this.options.profile_url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
                Accept: 'application/json',
            },
        });
        if (!userRequest.ok) {
            throw new UnauthorizedException(`Failed to fetch user profile:`);
        }
        const user = await userRequest.json();
        const userDara = await this.extractUserInfo(user);
        
        return {
            ...userDara,
            acsessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            expriesAt: Date.now() + (tokenResponse.expires_in * 1000),
            provider: this.options.name,
        }
    }
    
    public constructor(private readonly options: TypeBaseProviderOptions) {}



    public getRedirectUrl(){
        return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`;
    }


    set BaseUrl(value: string){
        this.BASE_URL = value;
    }

    get name() {
        return this.options.name;
    }


    get access_url() {
        return this.options.acess_url;
    }

    get profile_url() {
        return this.options.profile_url;
    }

    get scope() {
        return this.options.scopes;
    }

}