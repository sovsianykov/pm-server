import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query, UseGuards,
} from '@nestjs/common';
import { WorkHoursService } from './work-hours.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('/api/work-hours')
export class WorkHoursController {
  constructor(private readonly workHoursService: WorkHoursService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async getByUserAndMonth(
    @Param('email') email: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.workHoursService.getByUserAndMonth(email, year, month);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.workHoursService.deleteRecord(id);
  }
}
