import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import { createRoot } from "react-dom/client";

import { HttpService } from "@/core/services/HttpService";
import UserService from "@/core/services/UserService";

import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);
const renderApp = () =>
  root.render(
    <React.StrictMode>
      <NextUIProvider>
        <main className="dark text-foreground bg-background">
          <App />
        </main>
      </NextUIProvider>
    </React.StrictMode>,
  );
// UserService.initKeycloak(renderApp);
renderApp()

HttpService.configure();
