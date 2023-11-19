import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from '../storage/entities/Staff.entity';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dtos/create-staff.dto';

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
}
