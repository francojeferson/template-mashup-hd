import axios, { AxiosPromise } from "axios";
import { Fornecedor } from "../@types/Fornecedor";
import {
  Manufacturers,
  ManufacturersFilter,
  ManufacturersVerify,
} from "../@types/Manufacturers";
import xhr from "./xhr";

export interface FormularioLogin {
  login: string;
  senha: string;
}

interface ResultFornecedor {
  error: boolean;
  msg: string;
  recordset: Fornecedor[];
}

const { REACT_APP_API_KEYCLOAK, REACT_APP_API_TRP, REACT_APP_SHARED } =
  process.env;

/**
 * KEYCLOAK
 */
const refreshToken = <P>(refresh_token: P) =>
  axios.post(`${REACT_APP_API_KEYCLOAK}/login/refreshtoken`, {
    refresh_token,
  });

/**
 * Login
 */
const login = (params: FormularioLogin): AxiosPromise =>
  xhr.post("/login", params);
const verificarSession = (sessionHash: string): AxiosPromise =>
  xhr.post("/session/check", {}, { headers: { Authorization: sessionHash } });

const getFornecedores = (token: string): AxiosPromise<ResultFornecedor> =>
  xhr.get(`${REACT_APP_SHARED}/fornecedor`, {
    headers: {
      Authorization: token,
    },
  });

const addManufactures = (
  manufacturers: Manufacturers,
  token: string,
): AxiosPromise<ResultFornecedor> =>
  xhr.post(`${REACT_APP_API_TRP}/tpr`, manufacturers, {
    headers: {
      Authorization: token,
    },
  });

const editManufactures = (
  id: number,
  manufacturers: Manufacturers,
  token: string,
): AxiosPromise<ResultFornecedor> =>
  xhr.put(`${REACT_APP_API_TRP}/tpr/${id}`, manufacturers, {
    headers: {
      Authorization: token,
    },
  });

const deleteManufactures = (
  id: number,
  token: string,
): AxiosPromise<ResultFornecedor> =>
  xhr.delete(`${REACT_APP_API_TRP}/tpr/${id}`, {
    headers: {
      Authorization: token,
    },
  });
const getManufacturer = (
  manufacturers: ManufacturersFilter | undefined,
  token: string,
): AxiosPromise<ResultFornecedor | any> =>
  xhr.get(`${REACT_APP_API_TRP}/tpr`, {
    params: manufacturers,
    headers: {
      Authorization: token,
    },
  });

const getManufacturerVerify = (
  manufacturers: ManufacturersVerify | undefined,
  token: string,
): AxiosPromise<ResultFornecedor | any> =>
  xhr.get(`${REACT_APP_API_TRP}/tpr/verify`, {
    params: manufacturers,
    headers: {
      Authorization: token,
    },
  });

export default {
  refreshToken,
  login,
  verificarSession,
  getFornecedores,
  addManufactures,
  editManufactures,
  getManufacturer,
  deleteManufactures,
  getManufacturerVerify,
};
