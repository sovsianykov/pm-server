import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { WorkHoursService } from './work-hours.service';

@Controller('/api/work-hours')
export class WorkHoursController {
  constructor(private readonly workHoursService: WorkHoursService) {}

  @Post()
  async createOrUpdate(
    @Body('email') email: string,
    @Body('date') date: string,
    @Body('hoursWorked') hoursWorked: number,
    @Body('status') status: string,
  ) {
    return this.workHoursService.createOrUpdate(
      email,
      date,
      hoursWorked,
      status,
    );
  }

  @Get('/:email')
  async getByUserAndMonth(
    @Param('email') email: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.workHoursService.getByUserAndMonth(email, year, month);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.workHoursService.deleteRecord(id);
  }
}
