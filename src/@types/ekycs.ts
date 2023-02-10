export interface IListEkycs {
  id: string;
  active: boolean;
  name: string;
  desc?: string;
  created_at: string;
}

export interface ICreateEkyc {
  name: string;
  desc?: string;
  api: string;
  provider_id: string;
}

export interface IAddEkycToPartner {
  ekyc_id: string;
  partner_id: string;
  price: number;
}

export interface IRemoveEkycFromPartner {
  id: string;
}

export interface IUpdateEkycFromPartner {
  id: string;
  price: number;
}

export interface IListPartnerEkycs {
  id: string;
  name: string;
  created_at: string;
  ekycs: {
    id: string;
    ekyc_id: string;
    price: number;
  }[];
}
