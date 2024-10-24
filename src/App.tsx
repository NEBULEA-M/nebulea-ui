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
import "./theme/variables.scss";

import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { FC, Suspense } from "react";
import { Route } from "react-router-dom";

import RenderOnAnonymous from "@/components/templates/RenderOnAnonymous";
import RenderOnAuthenticated from "@/components/templates/RenderOnAuthenticated";
import { getRoutes } from "@/core/routeConfig";

setupIonicReact();

const App: FC = () => {

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <IonRouterOutlet id="main">
            <Suspense>
              {getRoutes().map((route) =>
                route.isSecure ? (
                  <RenderOnAuthenticated key={route.path}>
                    <Route key={route.path} path={route.path} component={route.component} />
                  </RenderOnAuthenticated>
                ) : (
                  <RenderOnAnonymous key={route.path}>
                    <Route key={`${route.path}`} path={route.path} component={route.component} />
                  </RenderOnAnonymous>
                )
              )}
            </Suspense>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
