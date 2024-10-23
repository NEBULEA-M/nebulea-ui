import React, { lazy } from "react";

const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const Control = lazy(() => import("@/pages/Control"));
const ArmBot = lazy(() => import("@/pages/ArmBot"));

interface Route {
  path: string;
  pageTitle: string;
  component: React.LazyExoticComponent<React.FC>;
  isSecure: boolean;
  permission: string[];
  subPages: Route[];
}

export const RoutePaths = {
  HOME: "/",
  LOGIN: "/login",
  CONTROL: "/control",
  ARM_BOT: "/arm-bot",
};

export const routes: Route[] = [
  {
    path: RoutePaths.LOGIN,
    pageTitle: "Login",
    component: Login,
    isSecure: false,
    permission: [],
    subPages: [],
  },
  {
    path: RoutePaths.HOME,
    pageTitle: "Home",
    component: Home,
    isSecure: false,
    permission: [],
    subPages: [],
  },
  {
    path: RoutePaths.CONTROL,
    pageTitle: "Control",
    component: Control,
    isSecure: false,
    permission: [],
    subPages: [],
  },

  {
    path: RoutePaths.ARM_BOT,
    pageTitle: "ArmBot",
    component: ArmBot,
    isSecure: false,
    permission: [],
    subPages: [],
  },
];

export const getRoutes = (initRoutes = routes, result: Route[] = []) => {
  initRoutes.forEach((route) => {
    result.push(route);
    if (route.subPages) {
      route.subPages.forEach((r) => getRoutes([r], result));
    }
  });
  return result;
};
