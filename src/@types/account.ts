export interface IInfoUser {
  email: string;
  name: string;
  otpauth_url_otp: string;
  active_otp: boolean;
  is_owner: boolean;
  permissions: string[];
}

export interface IInfoPartnerRes {
  data: {
    data: {
      id: string;
      name: string | null;
      phone_number: string | null;
      type: string | null;
    };
  };
}

export interface ISessionUser {
  id: string;
  ip: string;
  city: string;
  region: string;
  country: string;
  agent: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface IEmailUser {
  _id: string;
  title: string;
  email: string;
  body: string;
  template: string;
  status: string;
  message_error: string;
  stack_error: string;
  content_error: string;
  createdAt: string;
}

export interface IEmailUserRes {
  count: number;
  rows: IEmailUser[];
}
