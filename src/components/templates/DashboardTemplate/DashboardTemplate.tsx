import { IonCol, IonContent, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { Button } from "@nextui-org/button";
import { batteryHalf, navigateCircle } from "ionicons/icons";
import { useHistory } from "react-router-dom";

import armBotIcon from "@/assets/icon/armBotIcon.svg";
import { RoutePaths } from "@/core/routeConfig";

interface NavButtonProps {
  icon: string;
  path: string;
  onClick: (path: string) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, path, onClick }) => (
  <Button isIconOnly variant="flat" color="warning" onClick={() => onClick(path)} className="w-full max-w-[64px]">
    <IonIcon icon={icon} />
  </Button>
);

function DashboardTemplate() {
  const history = useHistory();

  const handleNavigation = (path: string) => {
    history.push(path);
  };

  return (
    <IonContent className="ion-padding">
      <IonGrid fixed>
        <IonRow className="ion-justify-content-center ion-align-items-center">
          <IonCol size="4" className="ion-text-center">
            <NavButton icon={batteryHalf} path={RoutePaths.LOGIN} onClick={handleNavigation} />
          </IonCol>

          <IonCol size="4" className="ion-text-center">
            <NavButton icon={navigateCircle} path={RoutePaths.CONTROL} onClick={handleNavigation} />
          </IonCol>

          <IonCol size="4" className="ion-text-center">
            <NavButton icon={armBotIcon} path={RoutePaths.ARM_BOT} onClick={handleNavigation} />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
}

export default DashboardTemplate;
