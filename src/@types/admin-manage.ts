export interface IListAdmins {
  id: string;
  active: boolean;
  permissions: string[];
  email: string;
  name: string;
  created_at: string;
  is_owner: boolean;
}

export interface ICreateAdmin {
  email: string;
  permissions: string[];
  password: string;
  name: string;
}
