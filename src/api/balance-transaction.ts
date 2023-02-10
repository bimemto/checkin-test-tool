import omit from 'lodash/omit';
import api from '@api/rest';
import {
  IExportBalanceTransaction,
  IListBalanceTransaction
} from '../@types/balance-transaction';
import Cookie from 'universal-cookie';
import axios from 'axios';

const cookie = new Cookie();

export const getListBalanceTransaction = ({
  queryKey
}: any): Promise<{
  count: number;
  rows: IListBalanceTransaction[];
}> =>
  api({
    endpoint: `balance-transaction`,
    method: 'GET',
    data: queryKey[1]
  });

export const updateBalanceTransaction = (data: IListBalanceTransaction) =>
  api({
    endpoint: `balance-transaction/${data.id}`,
    method: 'PUT',
    data: omit(data, ['id'])
  });

export const getBalanceProvider = () =>
  api({
    endpoint: `balance-transaction/balance-provider`,
    method: 'GET'
  });

export const exportExcelPayment = (data: IExportBalanceTransaction) =>
  axios({
    url: `${process.env.REACT_APP_API_DOMAIN}/balance-transaction/export-excel`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.get('tokenKYCAdmin'),
      'accept-language':
        localStorage.getItem('lang')?.replaceAll('"', '') || 'vi'
    },
    responseType: 'blob',
    params: {
      from: data?.from,
      to: data?.to,
      type: data?.type,
      status: data?.status,
      partner_id: data?.partner_id
    }
  });

export const getListBalancePartner = () =>
  api({
    endpoint: `balance-transaction/balance-partner`,
    method: 'GET'
  });

export const getBalancePartnerDetail = (partner_id: string) =>
  api({
    endpoint: `balance-transaction/balance-partner/${partner_id}`,
    method: 'GET'
  });
