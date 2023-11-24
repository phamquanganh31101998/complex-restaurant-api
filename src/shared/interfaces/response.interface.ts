export type IApiResponse<T = unknown> = {
  code: number;
  message: string;
  result: T;
};

export type IApiListResponse<T = unknown> = Omit<IApiResponse, 'result'> & {
  result: {
    pagination: Pagination;
    dataList: T;
  };
};

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}
