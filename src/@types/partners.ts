export interface IListPartners {
  id: string;
  name: string;
  active: boolean;
  partner_code: string;
  fee_cashout?: number;
  list_ips: string[];
  created_at: string;
}
