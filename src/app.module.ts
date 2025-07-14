import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProviderModule } from './auth/provider/provider.module';

@Module({
  imports: [ConfigModule.forRoot({
    ignoreEnvFile: true,
    isGlobal: true,
  }), PrismaModule, AuthModule, UserModule, ProviderModule
  ],
  
})
export class AppModule {}
