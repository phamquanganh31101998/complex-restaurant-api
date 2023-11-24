import { Staff } from '../storage/entities/Staff.entity';
import { Pagination } from '../shared/interfaces/response.interface';

export interface GetStaffListResult {
  pagination: Pagination;
  dataList: Staff[];
}
