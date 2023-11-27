import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  IApiListResponse,
  IApiResponse,
} from 'shared/interfaces/response.interface';
import { Staff } from 'storage/entities/Staff.entity';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { UpdateStaffDto } from './dtos/update-staff.dto';
import { GetStaffListDto } from './dtos/get-staff-list.dto';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Get()
  async getStaffList(
    @Query() getStaffListDto: GetStaffListDto,
  ): Promise<IApiListResponse<Staff[]>> {
    const result = await this.staffService.getStaffList(getStaffListDto);
    return {
      code: 200,
      message: 'Success!',
      result,
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
      result: staff,
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
      result: staff,
    };
  }

  @Put('/:id')
  async updateStaffById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStaffDto,
  ): Promise<IApiResponse<Staff>> {
    const staff = await this.staffService.updateStaffById(id, body);
    return {
      code: 200,
      message: 'Success!',
      result: staff,
    };
  }

  @Post('/check-in/:id')
  async checkInForStaff(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IApiResponse<null>> {
    await this.staffService.checkInForStaff(id);
    return {
      code: 200,
      message: 'Success!',
      result: null,
    };
  }
}
