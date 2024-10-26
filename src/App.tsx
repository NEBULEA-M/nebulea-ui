/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
/* Theme variables */
import "@/theme/variables.scss";

import {
  IonApp,
  IonContent,
  IonHeader,
  IonMenu,
  IonRouterOutlet,
  IonSpinner,
  IonSplitPane,
  IonTitle,
  IonToolbar,
  setupIonicReact
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Switch } from "@nextui-org/switch";
import { NextUIProvider } from "@nextui-org/system";
import { MoonIcon, SunIcon } from "lucide-react";
import { FC, Suspense, useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";

import { AuthGuard } from "@/components/AuthGuard";
import { getRoutes, RoutePaths } from "@/core/routeConfig";
import AuthService from "@/core/services/AuthService";
import { HttpService } from "@/core/services/HttpService";

// Initialize Ionic React before the app renders
setupIonicReact({
  mode: "md", // Force Material Design mode for consistency
});

const LoadingFallback: FC = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <IonSpinner name="circular" />
    <p className="ml-2">Loading...</p>
  </div>
);

const App: FC = () => {
  const [theme, setTheme] = useState("dark");
  const [menuEnabled, setMenuEnabled] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Enable menu after initial render to prevent hydration issues
  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuEnabled(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const [initState, setInitState] = useState<{
    isInitialized: boolean;
    error: string | null;
  }>({
    isInitialized: false,
    error: null,
  });

  useEffect(() => {
    const initApp = async () => {
      try {
        await AuthService.initStorage();
        HttpService.configure();
        setInitState({
          isInitialized: true,
          error: null,
        });
      } catch (error) {
        console.error("Failed to initialize app:", error);
        setInitState({
          isInitialized: true,
          error: "Failed to initialize application",
        });
      }
    };
    initApp();
  }, []);

  if (!initState.isInitialized) {
    return <LoadingFallback />;
  }

  if (initState.error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center flex-col">
        <p className="text-red-500 mb-4">Error: {initState.error}</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <NextUIProvider>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane when="md" contentId="main">
            {menuEnabled && (
              <IonMenu contentId="main" type="overlay">
                <IonHeader>
                  <IonToolbar>
                    <div className="p-1">
                      <IonTitle>Menu Content</IonTitle>
                      <Switch
                        className="p-3"
                        defaultSelected
                        size="lg"
                        onClick={toggleTheme}
                        thumbIcon={({ className }) =>
                          theme === "dark" ? <SunIcon className={className} /> : <MoonIcon className={className} />
                        }
                      >
                        Dark mode
                      </Switch>
                    </div>
                  </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">This is the menu content.</IonContent>
              </IonMenu>
            )}
            <IonRouterOutlet id="main">
              <Suspense fallback={<LoadingFallback />}>
                <Route exact path="/">
                  <Redirect to={RoutePaths.HOME} />
                </Route>

                {getRoutes().map((route) =>
                  <AuthGuard
                    key={route.path}
                    path={route.path}
                    component={route.component}
                    isSecure={route.isSecure}
                    permissions={route.permission}
                    exact
                  />
                )}
              </Suspense>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </NextUIProvider>
  );
};

export default App;
