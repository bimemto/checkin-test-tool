import omit from 'lodash/omit';
import api from '@api/rest';
import { IListProviders, ICreateProvider } from '../@types/providers';

export const getListProviders = (): Promise<IListProviders[]> =>
  api({
    endpoint: `providers`,
    method: 'GET'
  });

export const updateProvider = (data: IListProviders) =>
  api({
    endpoint: `providers/${data.id}`,
    method: 'PUT',
    data: omit(data, ['id'])
  });

export const createProvider = (data: ICreateProvider) =>
  api({
    endpoint: `providers`,
    method: 'POST',
    data
  });
