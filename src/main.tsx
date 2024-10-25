import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import { createRoot } from "react-dom/client";

import { HttpService } from "@/core/services/HttpService";

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
renderApp();

HttpService.configure();
