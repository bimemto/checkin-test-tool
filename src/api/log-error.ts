import api from '@api/rest';
import { ISearchLogError } from './../@types/log-error';

export const getLog = (data: ISearchLogError) =>
  api({
    endpoint: `log/error-log`,
    method: 'GET',
    params: data
  });
