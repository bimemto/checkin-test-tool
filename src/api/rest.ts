import { message } from 'antd';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookie from 'universal-cookie';

const cookie = new Cookie();

type InputMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Props {
  endpoint: string;
  method: InputMethodType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  returnData?: boolean;
  params?: any;
}

const fetcher = async (dataAxios: Props) => {
  const { endpoint, data, method, returnData, params } = dataAxios;
  let url = endpoint;
  if (method === 'GET' && data) {
    url += `?${new URLSearchParams(data).toString()}`;
  }
  return axios({
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie.get('tokenKYCAdmin')
    },
    url: `${process.env.REACT_APP_API_DOMAIN}/${url}`,
    params,
    data
  })
    .then((response: AxiosResponse) => {
      const res = response.data;
      if (res.errorCode !== 0) {
        const error = new Error(res.message);
        throw error;
      }
      if (returnData) {
        return res;
      }
      return res?.data;
    })
    .catch((error: AxiosError) => {
      const errors = new Error(error.message);
      if (error.response) {
        if (error.response.status === 403) {
          cookie.remove('tokenKYCAdmin');
          localStorage.removeItem('is_owner');
          localStorage.removeItem('permissions');
          setTimeout(() => {
            window.location.href = 'signin';
          }, 1000);
        }
        const data = error.response?.data as {
          message: string;
        };
        // The request was made and the server responded with a status code
        // that falls out of the range of 2x
        errors.message = data.message;
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        errors.message = `Error request`;
      }
      message.error(errors.message);
      throw errors;
    });
};

export default fetcher;
