import { IonSpinner } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Redirect, Route, useLocation } from "react-router-dom";

import { RoutePaths } from "@/core/routeConfig";
import UserService from "@/core/services/UserService";

interface AuthGuardProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  permissions?: string[];
  isSecure: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = React.memo(
  ({ component: Component, permissions = [], isSecure, ...rest }) => {
    const location = useLocation();
    const [authState, setAuthState] = useState({
      isLoading: true,
      isAuthenticated: false,
      hasPermission: false,
    });

    useEffect(() => {
      const checkAuth = async () => {
        if (!isSecure) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            hasPermission: true,
          });
          return;
        }

        try {
          const authenticated = await UserService.isLoggedIn();
          const hasPermission = permissions.length === 0 || (await UserService.hasRole(permissions));

          setAuthState({
            isLoading: false,
            isAuthenticated: authenticated,
            hasPermission,
          });
        } catch (error) {
          console.error("Auth check failed:", error);
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            hasPermission: false,
          });
        }
      };

      checkAuth();
    }, [isSecure, permissions]);

    if (authState.isLoading) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <IonSpinner name="circular" />
        </div>
      );
    }

    return (
      <Route
        {...rest}
        render={(props) => {
          // For non-secure routes
          if (!isSecure) {
            return <Component {...props} />;
          }

          // For secure routes
          if (!authState.isAuthenticated) {
            return (
              <Redirect
                to={{
                  pathname: RoutePaths.LOGIN,
                  state: { from: location },
                }}
              />
            );
          }

          if (permissions.length > 0 && !authState.hasPermission) {
            return (
              <Redirect
                to={{
                  pathname: RoutePaths.HOME,
                  state: { from: location },
                }}
              />
            );
          }

          return <Component {...props} />;
        }}
      />
    );
  },
);
