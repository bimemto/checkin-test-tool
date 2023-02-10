import api from '@api/rest';
import {
  IExportTransactions,
  IGetAllTraffic,
  IListTransactions
} from '../@types/transactions';

import Cookie from 'universal-cookie';
import axios from 'axios';

const cookie = new Cookie();

export const exportExcelTransactions = (data: IExportTransactions) =>
  axios({
    url: `${process.env.REACT_APP_API_DOMAIN}/transactions/export-excel`,
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
      api: data?.api,
      status: data?.status,
      trans_id: data?.trans_id,
      partner_id: data?.partner_id,
      call_api: data?.call_api
    }
  });

export const getListTransactions = ({
  queryKey
}: any): Promise<{
  count: number;
  rows: IListTransactions[];
}> =>
  api({
    endpoint: `transactions`,
    method: 'GET',
    data: queryKey[1]
  });

export const getAllTrafficNumber = (data: IGetAllTraffic) =>
  api({
    endpoint: `transactions/all-traffic`,
    method: 'GET',
    params: {
      from: data?.from,
      to: data?.to
    }
  });

export const getTrafficNumber = (data: IGetAllTraffic) =>
  api({
    endpoint: `transactions/traffic`,
    method: 'GET',
    params: {
      from: data?.from,
      to: data?.to
    }
  });

export const getAmount = (data: IGetAllTraffic) =>
  api({
    endpoint: `transactions/amount`,
    method: 'GET',
    params: {
      from: data?.from,
      to: data?.to
    }
  });

export const getDataChart = (data: IGetAllTraffic) =>
  api({
    endpoint: `transactions/chart`,
    method: 'GET',
    params: {
      from: data?.from,
      to: data?.to
    }
  });

export const getDataTimeChart = (data: IGetAllTraffic) =>
  api({
    endpoint: `transactions/time-chart`,
    method: 'GET',
    params: {
      from: data?.from,
      to: data?.to
    }
  });
