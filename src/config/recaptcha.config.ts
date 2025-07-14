import { isDev } from "@/libs/utils/is-dev-util";
import { ConfigService } from "@nestjs/config";
import { GoogleRecaptchaModuleOptions } from "@nestlab/google-recaptcha";

export const getRecaptchaConfig = async(
    ConfigService: ConfigService
): Promise<GoogleRecaptchaModuleOptions> => ({
    secretKey: ConfigService.getOrThrow<string>('GOOOGLE_RECAPTCHA_SECRET_KEY'),
    response: req => req.headers.recaptcha,
    skipIf: isDev(ConfigService)
})