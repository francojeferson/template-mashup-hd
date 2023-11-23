import jwtDecode, { JwtPayload } from "jwt-decode";
import moment from "moment";
import { ReactElement, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { StateRedux } from "../store/type-redux";
import { api } from "../utils";
import logForDev from "../utils/log-for-dev";

interface Props {
  component: ReactElement;
  publico?: boolean;
}

const backgroundBody = {
  add: () => document.querySelector("body")?.classList.add("bg-mtrix-dark"),
  remove: () =>
    document.querySelector("body")?.classList.remove("bg-mtrix-dark"),
};

// 25 minutos
const timeRefresh = 1500000;
// const timeRefresh = 10000;

const MiddlewareRoute = ({ component, publico }: Props): ReactElement => {
  const dispatch = useDispatch();
  const session = useSelector((state: StateRedux) => state.session);

  const refreshToken = useCallback(async () => {
    if (session && session.refreshToken) {
      const refreshtoken = session.refreshToken;
      try {
        const decoded: JwtPayload = jwtDecode(refreshtoken);
        // Token de refresh expirado
        if (decoded.exp && moment() > moment.unix(decoded.exp)) {
          logForDev("Token de refresh expirou");
          return;
        }
        const {
          data: { token, refresh_token },
        } = await api.refreshToken(refreshtoken);

        dispatch({
          type: "SESSION",
          session: {
            token,
            refreshToken: refresh_token,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [session, dispatch]);

  // Faz o refresh a cada atualização de tela
  useEffect(() => {
    if (!publico) {
      refreshToken();
    }
  }, [component]);

  // Faz o refresh a cada minuto definido em timeRefresh
  useEffect(() => {
    if (!publico) {
      setTimeout(() => {
        refreshToken();
      }, timeRefresh);
    }
  }, [publico, session, refreshToken]);

  /**
   * PUBLIC ROUTES ↓
   */

  if (publico && !session) {
    backgroundBody.add();
    return component;
  }
  // Sem sessionToken
  if (!session) {
    // return <Redirect to="/redirect" />;
  }

  /**
   * PRIVATE ROUTES ↓
   */
  backgroundBody.remove();
  if (session?.token) {
    const decoded: JwtPayload = jwtDecode(session?.token);
    if (decoded.exp && moment() > moment.unix(decoded.exp)) {
      console.log("Sessão expirada", { toastId: "toast-expired" });
      return <Redirect to="/redirect" />;
    }
    if (publico && session?.token) {
      return <Redirect to="/" />;
    }
  }

  // return container ? (<Container>{component}</Container>) : component;
  return component;
};

MiddlewareRoute.defaultProps = {
  publico: false,
};

export default MiddlewareRoute;
