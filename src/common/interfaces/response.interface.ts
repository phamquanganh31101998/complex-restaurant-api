export type IApiResponse<T = unknown> = {
  code: number;
  message: string;
  data: T;
};

export type IApiListResponse<T = unknown> = Omit<IApiResponse, 'data'> & {
  data: {
    pagination: {
      page: number;
      pageSize: number;
      total?: number;
    };
    dataList: T;
  };
};
