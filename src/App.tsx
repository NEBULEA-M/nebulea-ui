import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.scss";

import { IonApp, IonRouterOutlet, IonSpinner,IonSplitPane, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { FC, Suspense, useEffect, useState } from "react";
import { Redirect,Route } from "react-router-dom";

import { AuthGuard } from "@/components/AuthGuard";
import { getRoutes } from "@/core/routeConfig";
import { RoutePaths } from "@/core/routeConfig";
import AuthService from "@/core/services/AuthService";
import { HttpService } from "@/core/services/HttpService";

setupIonicReact();

const LoadingFallback: FC = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <IonSpinner name="circular" />
    <p className="ml-2">Loading...</p>
  </div>
);

const App: FC = () => {
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
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <IonRouterOutlet id="main">
            <Suspense fallback={<LoadingFallback />}>
              <Route exact path="/">
                <Redirect to={RoutePaths.HOME} />
              </Route>

              {getRoutes().map((route) => (
                <AuthGuard
                  key={route.path}
                  path={route.path}
                  component={route.component}
                  isSecure={route.isSecure}
                  permissions={route.permission}
                  exact
                />
              ))}

              <Route path="*">
                <Redirect to={RoutePaths.HOME} />
              </Route>
            </Suspense>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
