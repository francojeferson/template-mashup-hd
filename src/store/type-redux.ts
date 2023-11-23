import { Manufacturers, ManufacturersFilter } from "../@types/Manufacturers";

export interface SessionType {
  token?: string;
  refreshToken?: string;
}

export interface UserSessionType {
  id: string;
  name: string;
  email: string;
  userName: string;
}

interface Session {
  type: "SESSION";
  session: SessionType;
}

interface UserSession {
  type: "USER";
  usuario: UserSessionType;
}

interface manufacturersFilter {
  type: "FILTER_MANUFACTURER";
  manufacturersFilter: ManufacturersFilter;
}

interface manufacturers {
  type: "MANUFACTURER";
  manufacturers: Manufacturers[];
}

interface manufacturer {
  type: "MANUFACTURER_EDIT";
  manufacturer: Manufacturers;
}

export interface StateRedux {
  filtro: {
    manufacturersFilter: ManufacturersFilter | null;
  };
  manufacturer: Manufacturers | null;
  manufacturers: Manufacturers[] | null;
  session: SessionType | null;
  usuario: UserSessionType | null;
}

export type Action =
  | Session
  | UserSession
  | manufacturers
  | manufacturer
  | manufacturersFilter;
