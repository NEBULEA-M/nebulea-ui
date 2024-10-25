import "@/components/templates/LoginTemplate/LoginTemplate.css";

import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonSpinner,
  useIonRouter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { RoutePaths } from "@/core/routeConfig";
import AuthService from "@/core/services/AuthService";
import UserService from "@/core/services/UserService";

interface LocationState {
  from?: { pathname: string };
}

function LoginTemplate() {
  const router = useIonRouter();
  const location = useLocation<LocationState>();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await AuthService.initStorage();
        const isAuthenticated = await UserService.isLoggedIn();
        if (isAuthenticated) {
          const defaultPath = RoutePaths.HOME;
          const redirectPath = location.state?.from?.pathname || defaultPath;
          router.push(redirectPath, "root", "replace");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router, location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoading(true);
    setShowError(false);

    try {
      const success = await AuthService.login(credentials);
      if (success) {
        const defaultPath = RoutePaths.HOME;
        const redirectPath = location.state?.from?.pathname || defaultPath;
        router.push(redirectPath, "root", "replace");
      } else {
        setErrorMessage("Invalid username or password");
        setShowError(true);
        setShowLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login");
      setShowError(true);
      setShowLoading(false);
    }
  };

  return (
    <IonContent className="ion-padding">
      <div className="login-container">
        <IonCard>
          {isCheckingAuth ? (
            <div className="ion-text-center ion-padding">
              <IonSpinner name="circular" />
              <p>Checking authentication...</p>
            </div>
          ) : (
            <>
              <IonCardHeader>
                <IonCardTitle className="ion-text-center">Login</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <form onSubmit={handleLogin}>
                  <IonItem>
                    <IonLabel position="floating">Username</IonLabel>
                    <IonInput
                      type="text"
                      value={credentials.username}
                      onIonChange={(e) =>
                        setCredentials({
                          ...credentials,
                          username: e.detail.value || "",
                        })
                      }
                      required
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput
                      type="password"
                      value={credentials.password}
                      onIonChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.detail.value || "",
                        })
                      }
                      required
                    />
                  </IonItem>

                  <div className="ion-padding-top">
                    <IonButton expand="block" type="submit" disabled={showLoading}>
                      {showLoading ? "Logging in..." : "Login"}
                    </IonButton>
                  </div>
                </form>
              </IonCardContent>
            </>
          )}
        </IonCard>
      </div>

      <IonLoading isOpen={showLoading} message="Logging in..." backdropDismiss={false} />

      <IonAlert
        isOpen={showError}
        onDidDismiss={() => setShowError(false)}
        header="Error"
        message={errorMessage}
        buttons={["OK"]}
      />
    </IonContent>
  );
}

export default LoginTemplate;
