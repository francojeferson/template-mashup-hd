/* eslint-disable */
import axios, { Axios, AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import store from "../store";

const URL_API = process.env.REACT_APP_URL_API;

const header = (sessionHash: string | null | undefined) => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest",
  Authorization: `Bearer ${sessionHash}`,
});

const getHeaders = (): any => {
  const { session } = store.getState();
  return header(session?.token);
};

export const xhr = axios.create({
  baseURL: URL_API,
  headers: getHeaders(),
});

export const ejectSessionHash = () => {
  let items = xhr.interceptors.request as unknown as { handlers: [] };
  items.handlers.forEach((v: unknown, key: number) => {
    xhr.interceptors.request.eject(key);
  });
};

export const setTokenSession = async (tokenSession: string): Promise<Axios> => {
  ejectSessionHash();

  xhr.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      const updatedHeaders: AxiosRequestHeaders = {
        ...config.headers,
        ...header(tokenSession),
      } as unknown as AxiosRequestHeaders;

      return {
        ...config,
        headers: updatedHeaders as any,
      };
    },
    (error) => Promise.reject(error),
  );

  return xhr;
};

xhr.interceptors.response.use(
  (response) => {
    if (response.data.error) {
      console.log(response?.data?.error?.message);
    }

    return response;
  },
  (error) => {
    if (error.response.status === 426) {
      console.log(error?.response?.data?.message);
    }

    return Promise.reject(error);
  },
);

export default xhr;
