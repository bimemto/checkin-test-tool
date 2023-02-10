import omit from 'lodash/omit';
import api from '@api/rest';
import {
  IListEkycs,
  ICreateEkyc,
  IAddEkycToPartner,
  IListPartnerEkycs,
  IRemoveEkycFromPartner,
  IUpdateEkycFromPartner
} from '../@types/ekycs';

export const getListEkycs = (): Promise<IListEkycs[]> =>
  api({
    endpoint: `ekycs`,
    method: 'GET'
  });

export const allPartnerEkycs = (): Promise<IListPartnerEkycs[]> =>
  api({
    endpoint: `ekycs/all-partner-ekyc`,
    method: 'GET'
  });

export const getListApis = (): Promise<{ key: string; viName: string }[]> =>
  api({
    endpoint: `ekycs/apis`,
    method: 'GET'
  });

export const updateEkyc = (data: IListEkycs) =>
  api({
    endpoint: `ekycs/${data.id}`,
    method: 'PUT',
    data: omit(data, ['id'])
  });

export const createEkyc = (data: ICreateEkyc) =>
  api({
    endpoint: `ekycs`,
    method: 'POST',
    data
  });

export const addToPartner = (data: IAddEkycToPartner) =>
  api({
    endpoint: `ekycs/partner-ekyc`,
    method: 'POST',
    data
  });

export const removeFromPartner = (data: IRemoveEkycFromPartner) =>
  api({
    endpoint: `ekycs/partner-ekyc/${data.id}`,
    method: 'DELETE',
    data
  });

export const updatePartnerEkyc = (data: IUpdateEkycFromPartner) =>
  api({
    endpoint: `ekycs/partner-ekyc/${data.id}`,
    method: 'PUT',
    data: omit(data, ['id'])
  });
