import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';

interface UserCreationAttribute {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttribute> {
  @ApiProperty({ example: 'John', description: 'name' })
  @Column({ type: DataType.STRING(255), unique: false, allowNull: false })
  declare firstName: string;

  @ApiProperty({ example: 'Doe', description: 'last name' })
  @Column({ type: DataType.STRING(255), unique: false, allowNull: false })
  declare lastName: string;

  @ApiProperty({ example: 'Doe@gmail.com', description: 'email' })
  @Column({ type: DataType.STRING(255), unique: true, allowNull: false })
  declare email: string;

  @ApiProperty({ example: '123123', description: 'password' })
  @Column({ type: DataType.STRING(255), unique: false, allowNull: false })
  declare password: string;

  @ApiProperty({ example: 'js middle', description: 'qualification' })
  @Column({
    type: DataType.STRING(255),
    unique: false,
    allowNull: true,
    defaultValue: 'no qualified',
  })
  declare qualification: string;

  @ApiProperty({ example: 'true', description: ' is active' })
  @Column({ defaultValue: true })
  declare isActive: boolean;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
