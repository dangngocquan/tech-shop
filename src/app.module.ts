import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auths/auths/auths.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthsModule } from './auths/auths/auths.module';
import { JwtModule } from '@nestjs/jwt';
import { ShopsModule } from './shops/shops.module';
import { Shop } from './shops/entity/shop.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRESQL_HOST'),
        port: parseInt(configService.get<string>('POSTGRESQL_PORT')),
        username: configService.get<string>('POSTGRESQL_USER'),
        password: configService.get<string>('POSTGRESQL_PASSWORD'),
        database: configService.get<string>('POSTGRESQL_DATABASE'),
        entities: [User, Shop],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 120000, // milliseconds
      max: 100, // maximum number of items in cache
    }),
    UsersModule,
    AuthsModule,
    JwtModule,
    ShopsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
