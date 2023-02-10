export interface IListTransactions {
  id: string;
  amount: number;
  api: string;
  status: string;
  created_at: string;
}

export interface ISearchTransactions {
  page: number;
  limit: number;
  api?: string;
  status?: string;
  from?: number;
  to?: number;
  partner_id?: string;
  call_api?: boolean;
}

export interface IExportTransactions {
  trans_id?: string;
  api?: string;
  status?: string;
  from?: number;
  to?: number;
  partner_id?: string;
  call_api?: boolean;
}

export interface IGetAllTraffic {
  from: number;
  to: number;
}
