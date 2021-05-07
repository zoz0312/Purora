import axios from 'axios';
import {LOCALSTORAGE_TOKEN} from "@utils/constants";

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
  data?: object;
  async?: boolean;
}



export const $axios = async ({
  url = '',
  method,
  data = {},
  async = true,
}: axiosProps) => {
  const headers = {
    'x-jwt': localStorage.getItem(LOCALSTORAGE_TOKEN),
  };

  if (async) {
    return axios({
      headers,
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