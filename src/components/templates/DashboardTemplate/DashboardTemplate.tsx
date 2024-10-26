import { IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { Button } from "@nextui-org/button";
import { batteryHalf } from "ionicons/icons";
import React, { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";

import armBotIcon from "@/assets/icon/armBotIcon.svg";
import { RoutePaths } from "@/core/routeConfig";
import UserService from "@/core/services/UserService";

interface NavButtonProps {
  icon: string;
  path: string;
  isActive: boolean;
  onNavigate: (path: string) => Promise<void>;
}

const NavButton: React.FC<NavButtonProps> = React.memo(({ icon, path, isActive, onNavigate }) => (
  <Button
    isIconOnly
    variant={isActive ? "solid" : "flat"}
    color="warning"
    onClick={() => onNavigate(path)}
    className="w-full max-w-[64px]"
  >
    <IonIcon icon={icon} />
  </Button>
));

function DashboardTemplate() {
  const history = useHistory();
  const location = useLocation();

  const handleNavigation = useCallback(
    async (path: string) => {
      try {
        // Check for access secure routes
        if (path !== RoutePaths.LOGIN) {
          const isAuthenticated = await UserService.isLoggedIn();
          if (!isAuthenticated) {
            history.replace(RoutePaths.LOGIN);
            return;
          }
        }

        if (location.pathname !== path) {
          history.push(path);
        }
      } catch (error) {
        console.error("Navigation error:", error);
      }
    },
    [location.pathname, history],
  );

  // Navigation items
  const navItems = [
    {
      icon: batteryHalf,
      path: RoutePaths.EMPTY,
      requiresAuth: false,
    },
    {
      icon: armBotIcon,
      path: RoutePaths.ARM_BOT,
      requiresAuth: true,
    },
  ];

  return (
    <div className="mx-auto px-1">
      <IonGrid>
        <IonRow className="ion-justify-content-center ion-align-items-center">
          {navItems.map((item) => (
            <IonCol key={item.path} size="4" className="ion-text-center">
              <NavButton
                icon={item.icon}
                path={item.path}
                isActive={location.pathname === item.path}
                onNavigate={handleNavigation}
              />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </div>
  );
}

export default React.memo(DashboardTemplate);
