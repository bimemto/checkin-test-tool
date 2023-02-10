import { IEmailUserRes, ISessionUser } from '../@types/account';
import api from './rest';

export const detailAccount = (id: string | undefined) =>
  api({
    endpoint: `users/${id}`,
    method: 'GET'
  });

export const userLog = (data: any) =>
  api({
    endpoint: `users/user-logging`,
    method: 'GET',
    data: data
  });

export const adminLog = (data: any) =>
  api({
    endpoint: `admin-manage/admin-logging`,
    method: 'GET',
    data: data
  });

export const userSession = (id: string | undefined): Promise<ISessionUser[]> =>
  api({
    endpoint: `users/user-session-login/${id}`,
    method: 'GET'
  });

export const adminSession = (id: string | undefined): Promise<ISessionUser[]> =>
  api({
    endpoint: `admin-manage/admin-session-login/${id}`,
    method: 'GET'
  });

export const userMail = (data: any): Promise<IEmailUserRes> =>
  api({
    endpoint: `users/user-mail-send`,
    method: 'GET',
    data: data
  });
