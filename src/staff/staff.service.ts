import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from '../storage/entities/Staff.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
  ) {}

  async getAllStaff(): Promise<Staff[]> {
    return this.staffRepository.find({ withDeleted: false });
  }
}
