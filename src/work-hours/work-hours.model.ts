import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table({ tableName: 'work_hours' })
export class WorkHours extends Model<WorkHours> {
  @ForeignKey(() => User)
  @Column
  userForeignId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date: string; // YYYY-MM-DD

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 0 })
  trackedHours: number;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'WORK' })
  status: string; // WORK, HOLIDAY, VACATION, SICK

  @BelongsTo(() => User)
  user: User;
}
