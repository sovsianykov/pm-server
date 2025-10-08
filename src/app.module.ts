import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import * as process from 'node:process';
import { User } from './user/user.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { WorkHoursController } from './work-hours/work-hours.controller';
import { WorkHoursModule } from './work-hours/work-hours.module';
import { WorkHours } from './work-hours/work-hours.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      models: [User, Role, UserRoles, WorkHours],
      autoLoadModels: true,
    }),
    UserModule,
    RolesModule,
    AuthModule,
    JwtModule,
    WorkHoursModule,
  ],
  controllers: [AppController, AuthController, WorkHoursController],
  providers: [AuthService],
})
export class AppModule {}
