export interface ISearchLogError {
  from: number;
  to: number;
  limit: number;
  method?: string;
  page: number;
}

export interface IRecordLog {
  endpoint?: string;
  createdAt: string;
  error: string;
  message: string;
  method: string;
  name: string;
  stack: string;
  request: object;
  url: string;
}

export interface IResLog {
  count: number;
  rows: IRecordLog[];
}
