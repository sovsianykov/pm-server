import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationAttribute {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttribute> {
  @Column({ type: DataType.STRING(255), unique: false, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING(255), unique: false, allowNull: false })
  lastName: string;

  @Column({ type: DataType.STRING(255), unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING(255), unique: false, allowNull: false })
  password: string;

  @Column({
    type: DataType.STRING(255),
    unique: false,
    allowNull: true,
    defaultValue: 'no qualified',
  })
  qualification: string;

  @Column({ defaultValue: true })
  isActive: boolean;
}
