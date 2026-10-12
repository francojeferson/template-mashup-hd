import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

// `ReactDOM.render` foi removido no React 19; `createRoot` é a entrada atual.
const container = document.getElementById("root");
if (!container) {
  throw new Error('Elemento #root não encontrado em index.html.');
}

createRoot(container).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
