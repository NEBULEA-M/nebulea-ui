import { IonCol, IonContent, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { batteryHalf, navigateCircle } from "ionicons/icons";
import armBotIcon from "@/assets/icon/armBotIcon.svg"

function DashboardTemplate() {
  return (
    <IonContent class="ion-padding">
      <IonGrid>
        <IonRow>
          <IonCol>
            <Button isIconOnly variant="flat" as={Link} href="/login">
              <IonIcon icon={batteryHalf}></IonIcon>
            </Button>
          </IonCol>

          <IonCol>
            <Button isIconOnly variant="flat" color="warning" as={Link} href="/control">
              <IonIcon icon={navigateCircle}></IonIcon>
            </Button>
          </IonCol>
          <IonCol>
            <Button isIconOnly variant="flat" color="warning" as={Link} href="/arm-bot">
              <IonIcon icon={armBotIcon}></IonIcon>
            </Button>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
}

export default DashboardTemplate;
