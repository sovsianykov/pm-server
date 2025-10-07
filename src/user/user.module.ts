import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, UserRoles]), RolesModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
