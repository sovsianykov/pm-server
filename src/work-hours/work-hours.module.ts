import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkHours } from './work-hours.model';
import { WorkHoursService } from './work-hours.service';
import { WorkHoursController } from './work-hours.controller';
import { User } from '../user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([WorkHours, User])],
  providers: [WorkHoursService],
  controllers: [WorkHoursController],
  exports: [WorkHoursService],
})
export class WorkHoursModule {}
