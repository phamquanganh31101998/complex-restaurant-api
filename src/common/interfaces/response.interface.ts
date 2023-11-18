export type IApiResponse<T = unknown> = {
  code: number;
  message: string;
  data: T;
};
