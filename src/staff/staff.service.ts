import * as dotenv from 'dotenv';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from 'storage/entities/Staff.entity';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { UpdateStaffDto } from './dtos/update-staff.dto';
import { StaffNotFoundException } from './exceptions';
import { GetStaffListDto } from './dtos/get-staff-list.dto';
import { GetStaffListResult } from './interfaces';
import { JobName, QueueName } from 'shared/constants/queue.constant';
import { Cron } from '@nestjs/schedule';
import { EnvKey } from 'shared/constants/env-key.constant';
import { RedisService } from 'redis/redis.service';
import { REDIS_CHECK_IN_PREFIX } from 'shared/constants/redis.constant';

// can't either pass a value from config service to a decorators
// https://stackoverflow.com/questions/69463692/nestjs-using-environment-configuration-on-cron-decorator
const getCronCalculateCheckInTime = (): string => {
  dotenv.config();
  return process.env[EnvKey.STAFF_CHECK_IN_SUMMARY_CALCULATION_CRON_TIME];
};

@Injectable()
export class StaffService implements OnModuleInit {
  private staffIdList: number[] = [];

  constructor(
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
    @InjectQueue(QueueName.STAFF) private staffQueue: Queue,
    private redisService: RedisService,
  ) {}

  // Prefetch list of staff ids to be more convenient for action
  async onModuleInit() {
    await this.prefetchStaffIdList();
  }

  async prefetchStaffIdList() {
    const staffList = await this.staffRepository.find({ withDeleted: false });
    this.staffIdList = staffList.map((staff) => staff.id);
  }

  // add cronjob daily to calculate check in time of staff
  @Cron(getCronCalculateCheckInTime())
  async addCheckInCalculationJob() {
    await this.staffQueue.add(
      JobName.STAFF_CHECK_IN_SUMMARY_CALCULATION,
      {},
      {
        jobId: new Date().toLocaleDateString(),
      },
    );
  }

  async getStaffList(
    getStaffListDto: GetStaffListDto,
  ): Promise<GetStaffListResult> {
    const { page = 1, pageSize = 10, name = '' } = getStaffListDto;
    let condition: FindManyOptions<Staff> = {};

    if (!!name) {
      condition = { ...condition, where: { name: Like(`%${name}%`) } };
    }

    const [staffList, total] = await this.staffRepository.findAndCount({
      ...condition,
      withDeleted: false,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      pagination: {
        page,
        pageSize,
        total,
      },
      dataList: staffList,
    };
  }

  async getStaffById(id: number): Promise<Staff> {
    return await this.staffRepository.findOneBy({
      id,
    });
  }

  async createStaff(payload: CreateStaffDto): Promise<Staff> {
    const newStaff = this.staffRepository.save({ name: payload.name });

    // update current staff list
    await this.prefetchStaffIdList();

    return newStaff;
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

  // Temporary write to redis to avoid unnecessary queries to Database
  // Then summarize this data later
  async checkInForStaff(id: number) {
    if (!this.staffIdList.includes(id)) {
      throw new StaffNotFoundException('Cannot find staff with this id');
    }

    const now = new Date().getTime();
    const key = `${REDIS_CHECK_IN_PREFIX}:${id}`;

    const isExisted = await this.redisService.redis.exists(
      `${REDIS_CHECK_IN_PREFIX}:${id}`,
    );

    if (!isExisted) {
      await this.redisService.redis.set(key, JSON.stringify([now]));
      return;
    }

    const currentCheckInData = JSON.parse(
      await this.redisService.redis.get(key),
    );

    await this.redisService.redis.set(
      key,
      JSON.stringify([...currentCheckInData, now]),
    );
  }
}
