import omit from 'lodash/omit';
import api from '@api/rest';
import { IListPartners } from '../@types/partners';

export const getListPartners = (): Promise<IListPartners[]> =>
  api({
    endpoint: `partners`,
    method: 'GET'
  });

export const updatePartner = (data: IListPartners) =>
  api({
    endpoint: `partners/${data.id}`,
    method: 'PUT',
    data: omit(data, ['id'])
  });
