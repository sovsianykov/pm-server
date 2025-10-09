import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkHours } from './work-hours.model';
import { User } from '../user/user.model';
import { Op } from 'sequelize';

@Injectable()
export class WorkHoursService {
  constructor(
    @InjectModel(WorkHours)
    private readonly userRepository: typeof WorkHours,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}
  async createOrUpdate(
    email: string,
    date: string,
    hoursWorked: number,
    status: string = 'WORK',
  ): Promise<WorkHours> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(
        `User with email "${email}" not found in users table`,
      );
    }
    const [record, created]: [WorkHours, boolean] =
      await this.userRepository.findOrCreate({
        where: { email, date },
        defaults: {
          email,
          date,
          hoursWorked,
          status,
          userForeignId: user.id as string,
        } as unknown as WorkHours,
      });

    if (!created) {
      record.hoursWorked = hoursWorked;
      record.status = status;
      await record.save();
    }

    return record;
  }

  async getByUserAndMonth(email: string, year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    return this.userRepository.findAll({
      where: {
        email,
        date: { [Op.between]: [startDate, endDate] },
      },
      order: [['date', 'ASC']],
    });
  }
  async deleteRecord(id: number): Promise<{ deleted: boolean }> {
    const record: WorkHours | null = await this.userRepository.findByPk(id);
    if (!record) {
      throw new NotFoundException('Запись не найдена');
    }

    await record.destroy();
    return { deleted: true };
  }
}
