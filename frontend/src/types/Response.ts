export interface BaseResult<T> {
  data?: T;
  error?: Error | string;
  code: number;
}
