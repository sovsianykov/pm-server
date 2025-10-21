import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.model';
import { UserRoles } from './user-roles.model';
import { RoleValue } from './dto/add-role.dto';

interface RoleCreationAttribute {
  value: RoleValue;
  description: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttribute> {
  @ApiProperty({ example: 'ADMIN', description: 'role' })
  @Column({ type: DataType.STRING(255), unique: false, allowNull: false })
  declare value: RoleValue;

  @ApiProperty({ example: 'Can add info', description: 'description' })
  @Column({ type: DataType.STRING(255), unique: false, allowNull: false })
  description: string;

  @BelongsToMany(() => User, () => UserRoles)
  declare users: User[];
}
