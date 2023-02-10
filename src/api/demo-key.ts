import api from '@api/rest';

export const createDemoKey = () =>
  api({
    endpoint: 'demo-key',
    method: 'GET'
  });
