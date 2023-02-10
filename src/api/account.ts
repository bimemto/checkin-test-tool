import { IInfoUser } from '../@types/account';
import api from './rest';

export const getInfoUser = (): Promise<IInfoUser> =>
  api({
    endpoint: `admin`,
    method: 'GET'
  });
