/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

/**
 * Substitui o `react-scripts` d.ts do CRA.
 *
 * As variáveis mantêm o prefixo REACT_APP_ (ver `envPrefix` no vite.config.ts)
 * para que os `.env` e o pipeline existentes continuem valendo. Declará-las
 * aqui faz o tsc acusar nome errado em vez de entregar `undefined` em runtime.
 */
interface ImportMetaEnv {
  readonly REACT_APP_API_KEYCLOAK: string;
  readonly REACT_APP_API_TRP: string;
  readonly REACT_APP_HOST: string;
  readonly REACT_APP_IS_SECURE: string;
  readonly REACT_APP_OWNER: string;
  readonly REACT_APP_PORT: string;
  readonly REACT_APP_PREFIX: string;
  readonly REACT_APP_QVF_ID: string;
  readonly REACT_APP_SHARED: string;
  readonly REACT_APP_URL_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
