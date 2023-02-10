import omit from 'lodash/omit';
import api from '@api/rest';
import { IListUsers } from '../@types/users';

export const getListUsers = (): Promise<IListUsers[]> =>
  api({
    endpoint: `users`,
    method: 'GET'
  });

export const updateUser = (data: IListUsers) =>
  api({
    endpoint: `users/${data.id}`,
    method: 'PUT',
    data: omit(data, ['id'])
  });
