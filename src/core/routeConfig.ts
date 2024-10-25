import React, { lazy } from "react";

const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const Control = lazy(() => import("@/pages/Control"));
const ArmBot = lazy(() => import("@/pages/ArmBot"));

export interface Route {
  path: string;
  pageTitle: string;
  component: React.LazyExoticComponent<React.FC>;
  isSecure: boolean;
  permission: string[];
  subPages?: Route[];
}

export const RoutePaths = {
  HOME: "/home",
  LOGIN: "/login",
  CONTROL: "/control",
  ARM_BOT: "/arm-bot",
  UNAUTHORIZED: "/unauthorized",
} as const;

export const routes: Route[] = [
  {
    path: RoutePaths.HOME,
    pageTitle: "Home",
    component: Home,
    isSecure: true,
    permission: [],
    subPages: [],
  },
  {
    path: RoutePaths.LOGIN,
    pageTitle: "Login",
    component: Login,
    isSecure: false,
    permission: [],
    subPages: [],
  },
  {
    path: RoutePaths.CONTROL,
    pageTitle: "Control",
    component: Control,
    isSecure: true,
    permission: [],
    subPages: [],
  },
  {
    path: RoutePaths.ARM_BOT,
    pageTitle: "ArmBot",
    component: ArmBot,
    isSecure: true,
    permission: [],
    subPages: [],
  },
];

export const getRoutes = (initRoutes = routes): Route[] => {
  const flattenRoutes = (routes: Route[]): Route[] => {
    return routes.reduce<Route[]>((acc, route) => {
      acc.push(route);
      if (route.subPages && route.subPages.length > 0) {
        acc.push(...flattenRoutes(route.subPages));
      }
      return acc;
    }, []);
  };

  return flattenRoutes(initRoutes);
};
