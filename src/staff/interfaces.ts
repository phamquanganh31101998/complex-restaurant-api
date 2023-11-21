import { Staff } from '../storage/entities/Staff.entity';
import { Pagination } from '../common/interfaces/response.interface';

export interface GetStaffListResult {
  pagination: Pagination;
  dataList: Staff[];
}
