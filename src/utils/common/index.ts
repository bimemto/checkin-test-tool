import moment from 'moment';

export const IPermission = {
  MANAGE_TRANSACTION: 'manage_transaction',
  MANAGE_PARTNER: 'manage_partner',
  MANAGE_BALANCE_PARTNER: 'manage_balance_partner',
  MANAGE_PRODUCT: 'manage_product',
  DEMO_KEY: 'demo_key',
  ERROR_LOG: 'error_log'
};

export const sortByDate = (a: string, b: string) => {
  return moment(a).diff(moment(b));
};

export const renderStatusTag = (status: string) => {
  switch (status) {
    case 'PROCESSING':
      return 'processing';
    case 'SUCCESS':
      return 'success';
    case 'FAILED':
      return 'error';
    default:
      return 'default';
  }
};

export function makePassword(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const statusText: any = {
  GET: 'blue',
  POST: 'green',
  PUT: 'orange',
  PATCH: 'orange',
  DELETE: 'red',
  Query: 'cyan'
};

export const method = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'Query'];
