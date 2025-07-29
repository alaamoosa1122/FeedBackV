import React from "react";
import ReactDOM from "react-dom/client"; // <-- note the '/client'
import { Provider } from "react-redux";
import store from "./Store/store";
import App from "./App";
import AdminAddEvent from './Components/AdminAddEvent';
import { LanguageProvider } from './Store/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </LanguageProvider>
  </React.StrictMode>
);