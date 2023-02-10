import omit from 'lodash/omit';
import api from '@api/rest';
import { IListAdmins, ICreateAdmin } from '../@types/admin-manage';

export const getListAdmins = (): Promise<IListAdmins[]> =>
  api({
    endpoint: `admin-manage`,
    method: 'GET'
  });

export const updateAdmin = (data: IListAdmins) =>
  api({
    endpoint: `admin-manage/${data.id}`,
    method: 'PUT',
    data: omit(data, ['id'])
  });

export const createAdmin = (data: ICreateAdmin) =>
  api({
    endpoint: `admin-manage`,
    method: 'POST',
    data
  });

export const getListPermission = () =>
  api({
    endpoint: `admin-manage/permissions`,
    method: 'GET'
  });

export const getAdminInfo = (id: string) =>
  api({
    endpoint: `admin-manage/${id}`,
    method: 'GET'
  });

export const deleteAdmin = (id: string) =>
  api({
    endpoint: `admin-manage/${id}`,
    method: 'DELETE'
  });
