import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { IApiResponse } from '../common/interfaces/response.interface';
import { Staff } from '../storage/entities/Staff.entity';
import { CreateStaffDto } from './dtos/create-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Get()
  async getAllStaff(): Promise<IApiResponse<Staff[]>> {
    const staffList = await this.staffService.getAllStaff();
    return {
      code: 200,
      message: 'Get staff list success!',
      data: staffList,
    };
  }

  @Get('/:id')
  async getStaffById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IApiResponse<Staff>> {
    const staff = await this.staffService.getStaffById(id);
    return {
      code: 200,
      message: 'Success!',
      data: staff,
    };
  }

  @Post()
  async createStaff(
    @Body() body: CreateStaffDto,
  ): Promise<IApiResponse<Staff>> {
    const staff = await this.staffService.createStaff(body);
    return {
      code: 200,
      message: 'Success!',
      data: staff,
    };
  }
}
