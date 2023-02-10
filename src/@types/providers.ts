export interface IListProviders {
  id: string;
  active: boolean;
  name: string;
  desc?: string;
  created_at: string;
}

export interface ICreateProvider {
  name: string;
  desc?: string;
}
