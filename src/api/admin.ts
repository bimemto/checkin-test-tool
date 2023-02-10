import api from '@api/rest';
import { IUpdateAdmin } from '../@types/admin';

export const updateAdmin = (data: IUpdateAdmin) =>
  api({
    endpoint: `admin`,
    method: 'PUT',
    data: data
  });

export const changePassword = (data: {
  old_password: string;
  new_password: string;
}) =>
  api({
    endpoint: 'admin/change-password',
    method: 'PUT',
    data
  });
