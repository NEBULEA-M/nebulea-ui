import { IonSpinner } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom";

import { RoutePaths } from "@/core/routeConfig";
import AuthService from "@/core/services/AuthService";
import UserService from "@/core/services/UserService";

interface AuthGuardProps extends Omit<RouteProps, "component"> {
  component: React.ComponentType<any>;
  permissions?: string[];
  isSecure: boolean;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean | null;
  hasPermission: boolean;
  error: string | null;
}

const initialAuthState: AuthState = {
  isLoading: true,
  isAuthenticated: null,
  hasPermission: true,
  error: null,
};

export const AuthGuard: React.FC<AuthGuardProps> = ({ component: Component, permissions = [], isSecure, ...rest }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      if (!isSecure) {
        setAuthState((prev) => ({ ...prev, isLoading: false, isAuthenticated: null }));
        return;
      }

      try {
        // Add a small delay to prevent rapid auth checks
        await new Promise((resolve) => setTimeout(resolve, 100));

        const authenticated = await UserService.isLoggedIn();
        let hasPermission = true;

        if (authenticated && permissions.length > 0) {
          hasPermission = await UserService.hasRole(permissions);
        }

        if (mounted) {
          setAuthState({
            isLoading: false,
            isAuthenticated: authenticated,
            hasPermission,
            error: null,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (mounted) {
          // Handle storage access errors gracefully
          const isStorageError =
            error instanceof DOMException && (error.name === "SecurityError" || error.name === "QuotaExceededError");

          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            hasPermission: false,
            error: isStorageError ? "Storage access error" : "Authentication failed",
          });

          // If there's a storage error, try to clean up
          if (isStorageError) {
            try {
              await AuthService.clearAuth();
            } catch (clearError) {
              console.error("Failed to clear storage:", clearError);
            }
          }
        }
      }
    };

    // Debounce auth checks
    const authCheckTimeout = setTimeout(checkAuth, 100);

    return () => {
      mounted = false;
      clearTimeout(authCheckTimeout);
    };
  }, [permissions, isSecure, location.pathname]);

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
        // Handle storage/security errors
        if (authState.error === "Storage access error") {
          return (
            <Redirect
              to={{
                pathname: RoutePaths.LOGIN,
                state: {
                  from: location,
                  error: "Please log in again",
                },
              }}
            />
          );
        }

        // For non-secure routes
        if (!isSecure) {
          // Prevent authenticated users from accessing login
          if (props.location.pathname === RoutePaths.LOGIN && authState.isAuthenticated) {
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
        }

        // For secure routes
        if (!authState.isAuthenticated) {
          // Only redirect if we're sure about the authentication state
          if (authState.isAuthenticated === false) {
            return (
              <Redirect
                to={{
                  pathname: RoutePaths.LOGIN,
                  state: {
                    from: location,
                    error: authState.error,
                  },
                }}
              />
            );
          }
          return null; // Don't render anything while checking auth
        }

        if (permissions.length > 0 && !authState.hasPermission) {
          return (
            <Redirect
              to={{
                pathname: RoutePaths.HOME,
                state: {
                  from: location,
                  error: "Insufficient permissions",
                },
              }}
            />
          );
        }

        return <Component {...props} />;
      }}
    />
  );
};
