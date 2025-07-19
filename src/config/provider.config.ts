import { TypeOptions } from '@/auth/provider/provider.constans'
import { GoogleProvider } from '@/auth/provider/service/google.provider'
import { YandexProvider } from '@/auth/provider/service/yandex.provider'
import { ConfigService } from '@nestjs/config'




export const getProvidersConfig = async (
	configService: ConfigService
): Promise<TypeOptions> => ({
	baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
	services: [
		new GoogleProvider({
                name: 'google',
                authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
                access_url: 'https://oauth2.googleapis.com/token',
                profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
                client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
                client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
                scopes: ['email', 'profile']
            }),
		new YandexProvider({
        
            name: 'yandex',
            authorize_url: 'https://oauth.yandex.ru/authorize',
            access_url: 'https://oauth.yandex.ru/token',
            profile_url: 'https://login.yandex.ru/info?format=json',
            client_id: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
            client_secret: configService.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
            scopes: ['login:email', 'login:avatar', 'login:info']
        })
	]
})