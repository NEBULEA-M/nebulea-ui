import { NextUIProvider } from "@nextui-org/system";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import UserService from "@/core/services/UserService";
import { HttpService } from "@/core/services/HttpService";

const container = document.getElementById("root");
const root = createRoot(container!);
const renderApp = () => root.render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="dark text-foreground bg-background">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>
);
UserService.initKeycloak(renderApp);

HttpService.configure();