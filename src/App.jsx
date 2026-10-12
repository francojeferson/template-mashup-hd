import { setCookie } from "nookies";
import { BookMarkProvider } from "./context/BookMarkContainer";
import { ConfigProvider } from "./context/Config";
import { ExportIdProvider } from "./context/ExportId";
import { FilterBarProvider } from "./context/FilterBar";
import { FiltersProvider } from "./context/Filters";
import { LeftBarProvider } from "./context/LeftBar";
import { ModalProvider } from "./context/Modal";
import { QlikProvider } from "./context/Qlik";
import { SelectionsProvider } from "./context/Selections";
import Layout from "./pages/Layout";
import "./style.scss";

function App() {
  const query = new URLSearchParams(window.location.search);
  if (query.get("u")) {
    setCookie(null, "userHash", query.get("u"), {
      path: "/",
      maxAge: 72576000,
      secure: true,
      domain: ".mtrix.com.br",
    });
  }
  const config = {
    host: import.meta.env.REACT_APP_HOST,
    prefix: import.meta.env.REACT_APP_PREFIX,
    port: isNaN(Number(import.meta.env.REACT_APP_PORT))
      ? import.meta.env.REACT_APP_PORT
      : Number(import.meta.env.REACT_APP_PORT),
    isSecure:
      import.meta.env.REACT_APP_IS_SECURE === "true" ||
      import.meta.env.REACT_APP_IS_SECURE,
  };

  return (
    <QlikProvider config={config}>
      <SelectionsProvider>
        <BookMarkProvider>
          <ModalProvider>
            <FilterBarProvider>
              <LeftBarProvider>
                <ConfigProvider>
                  <FiltersProvider>
                    <ExportIdProvider>
                      <Layout />
                    </ExportIdProvider>
                  </FiltersProvider>
                </ConfigProvider>
              </LeftBarProvider>
            </FilterBarProvider>
          </ModalProvider>
        </BookMarkProvider>
      </SelectionsProvider>
    </QlikProvider>
  );
}

export default App;
