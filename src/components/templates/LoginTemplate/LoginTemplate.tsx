import "@/components/templates/LoginTemplate/LoginTemplate.css";

import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonLoading,
  IonSpinner,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { RoutePaths } from "@/core/routeConfig";
import AuthService from "@/core/services/AuthService";
import UserService from "@/core/services/UserService";

interface LocationState {
  from?: { pathname: string };
}

function LoginTemplate() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Add refs for the input fields
  const usernameRef = useRef<HTMLIonInputElement>(null);
  const passwordRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await UserService.isLoggedIn();
        if (isAuthenticated) {
          const defaultPath = RoutePaths.HOME;
          const redirectPath = location.state?.from?.pathname || defaultPath;
          history.push(redirectPath);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [history, location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the final values directly from the input refs
    const finalUsername = (await usernameRef.current?.getInputElement().then((input) => input?.value)) || "";
    const finalPassword = (await passwordRef.current?.getInputElement().then((input) => input?.value)) || "";

    const finalCredentials = {
      username: finalUsername,
      password: finalPassword,
    };

    if (!finalCredentials.username || !finalCredentials.password) {
      setErrorMessage("Please fill in all fields");
      setShowError(true);
      return;
    }

    setShowLoading(true);
    setShowError(false);

    try {
      const success = await AuthService.login(finalCredentials);
      if (success) {
        const defaultPath = RoutePaths.HOME;
        const redirectPath = location.state?.from?.pathname || defaultPath;
        window.location.href = redirectPath;
      } else {
        setErrorMessage("Invalid username or password");
        setShowError(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login");
      setShowError(true);
    } finally {
      setShowLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin(event);
    }
  };

  return (
    <>
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
                    <IonInput
                      ref={usernameRef}
                      label="Username"
                      type="text"
                      value={credentials.username}
                      onIonChange={(e) =>
                        setCredentials({
                          ...credentials,
                          username: e.detail.value || "",
                        })
                      }
                      onKeyPress={handleKeyPress}
                      required
                    />
                  </IonItem>

                  <IonItem>
                    <IonInput
                      ref={passwordRef}
                      label="Password"
                      type="password"
                      value={credentials.password}
                      onIonChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.detail.value || "",
                        })
                      }
                      onKeyPress={handleKeyPress}
                      required
                    >
                      <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                    </IonInput>
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
    </>
  );
}

export default LoginTemplate;
