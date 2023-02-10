export interface IListBalanceTransaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  created_at: string;
  partner: {
    name: string;
  };
}

export interface ISearchBalanceTransaction {
  page: number;
  limit: number;
  type?: string;
  status?: string;
  from?: number;
  to?: number;
  partner_id?: string;
}

export interface IExportBalanceTransaction {
  type?: string;
  status?: string;
  from?: number;
  to?: number;
  partner_id?: string;
}

export interface IListBalancePartner {
  partner_id: string;
  partner_name: string;
  balance: number;
  partner_custom_name: string;
}
