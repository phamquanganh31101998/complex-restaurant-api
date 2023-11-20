import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from 'storage/entities/Staff.entity';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { UpdateStaffDto } from './dtos/update-staff.dto';
import { StaffNotFoundException } from './exceptions';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
  ) {}

  async getAllStaff(): Promise<Staff[]> {
    return await this.staffRepository.find({ withDeleted: false });
  }

  async getStaffById(id: number): Promise<Staff> {
    return await this.staffRepository.findOneBy({
      id,
    });
  }

  async createStaff(payload: CreateStaffDto): Promise<Staff> {
    return this.staffRepository.save({ name: payload.name });
  }

  async updateStaffById(
    id: number,
    updateStaffDto: UpdateStaffDto,
  ): Promise<Staff> {
    const staff = await this.staffRepository.findOneBy({ id });

    if (!staff) {
      throw new StaffNotFoundException('Cannot find staff with this id');
    }

    return this.staffRepository.save({ ...staff, ...updateStaffDto });
  }
}
