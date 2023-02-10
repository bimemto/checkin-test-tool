import api from '@api/rest';
import { IUserLogin } from '../@types/auth';

export const adminSignIn = (data: IUserLogin) =>
  api({
    endpoint: `admin/login`,
    method: 'POST',
    data: data,
    returnData: true
  });

export const adminSignOut = () =>
  api({
    endpoint: 'admin/logout',
    method: 'PUT'
  });
