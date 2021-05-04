import axios from 'axios';

const hostURL = process.env.REACT_APP_HOST_URL;

interface axiosProps {
  url: string;
  method: 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';
  data: object;
  async?: boolean;
}

export const $axios = async ({
  url = '',
  method,
  data = {},
  async = true,
}: axiosProps) => {
  if (async) {
    return axios({
      method,
      url: `${hostURL}${url}`,
      data,
    });
  }

  axios({
    method,
    url,
    data,
  });

  return;
}