import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class GetStaffListDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  pageSize?: number;

  @IsOptional()
  @IsString()
  name?: string;
}
