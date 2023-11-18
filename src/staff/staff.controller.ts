import { Controller, Get } from '@nestjs/common';
import { StaffService } from './staff.service';
import { IApiResponse } from '../common/interfaces/response.interface';
import { Staff } from '../storage/entities/Staff.entity';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Get('/all')
  async getAllStaff(): Promise<IApiResponse<Staff[]>> {
    const staffList = await this.staffService.getAllStaff();
    return {
      code: 200,
      message: 'Get staff list success!',
      data: staffList,
    };
  }
}
