import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Staff } from './Staff.entity';

@Entity()
export class StaffCheckin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  staffId: number;

  @ManyToOne(() => Staff)
  staff: Staff;

  // format: 01-01-2023
  @Column({ length: 10, nullable: false })
  @Index('idx_check_in_date')
  date: string;

  // format: 08:00:00
  @Column({ length: 8, nullable: false })
  checkinTime: string;

  // format: 18:00:00 or null
  @Column({ length: 8, nullable: true })
  checkoutTime: string;

  constructor(partial: Partial<StaffCheckin>) {
    Object.assign(this, partial);
  }
}
