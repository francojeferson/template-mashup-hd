import jwtDecode, { JwtPayload } from "jwt-decode";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteState } from "../../store/local-storage";
import { logForDev, setTokenSession } from "../../utils";

const { REACT_APP_OWNER } = process.env;

export interface Payload {
  name: string;
  family_name: string;
  given_name: string;
  preferred_username: string;
  email_verified: boolean;
  email: string;
  realm_access: {
    roles: string[];
  };
  resource_access: {
    [x: string]: {
      roles: string[];
    };
  };
}

const Auth = () => {
  const queryParameters = new URLSearchParams(
    window.location.href.split("#").pop(),
  );
  const token = queryParameters.get("/auth?token");
  const refreshToken = queryParameters.get("refreshtoken");
  const dispatch = useDispatch();
  const history = useHistory();

  const [loop, setLoop] = useState(0);

  document.querySelector("body")?.classList.add("bg-mtrix-dark");

  const porcentagem = 100;
  const timeMaxLoad = 0.066666667;

  const decodeToken = (t: string): JwtPayload & Payload => jwtDecode(t);

  const getRealm = (decoded: any) =>
    decoded ? decoded.iss.split("/").slice(-1)[0] : null;

  const verifyToken = useCallback(() => {
    if (!token) {
      logForDev("Token não informado");
      window.location.replace(`${REACT_APP_OWNER}/login`);
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded.exp) {
      logForDev("Token inválido");
      window.location.replace(`${REACT_APP_OWNER}/login`);
      return;
    }
    if (moment() > moment.unix(decoded.exp)) {
      logForDev("Token expirado");
      window.location.replace(`${REACT_APP_OWNER}/login`);
    }

    const realm = getRealm(decoded);
    if (!realm) {
      logForDev("Realm não encontrado no token");
      window.location.replace(`${REACT_APP_OWNER}/login`);
    }
    if (realm.toLocaleLowerCase() !== "mtrix") {
      alert("Você não está autorizado(a)");
      setTimeout(() => {
        deleteState();
        window.location.replace(`${REACT_APP_OWNER}/login`);
      }, 1000);
    }
  }, [token]);

  const motorzinho = useCallback(() => {
    if (loop < porcentagem) {
      setTimeout(() => {
        setLoop(loop + 1);
      }, timeMaxLoad);
    }
  }, [loop]);

  useEffect(() => deleteState(), []);

  useEffect(() => motorzinho(), [motorzinho]);

  useEffect(() => verifyToken(), [verifyToken]);

  useEffect(() => {
    if (loop === porcentagem) {
      setTimeout(() => {
        if (!token) {
          logForDev("Token não informado");
          window.location.replace(`${REACT_APP_OWNER}/home`);
          return;
        }

        const decoded = decodeToken(token);

        dispatch({
          type: "SESSION",
          session: {
            token,
            refreshToken,
          },
        });

        dispatch({
          type: "USER",
          usuario: {
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
            userName: decoded.preferred_username,
          },
        });

        setTokenSession(token || "");
        history.push("/");
      }, 1000);
    }
  }, [loop, dispatch, history, token, refreshToken]);

  return (
    <div className="progress">
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        aria-valuenow={loop}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ width: `${loop}%` }}
      />
    </div>
  );
};

export default Auth;
