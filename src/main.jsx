import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "i18n/config";
import "simplebar-react/dist/simplebar.min.css";
import "styles/index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="255796235364-9or324oh27utd0ibfjprlpn0a01mer4k.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);