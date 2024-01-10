import { IonCol, IonContent, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { batteryHalf, navigateCircle } from "ionicons/icons";

function DashboardTemplate(props: any) {
  return (
    <IonContent class="ion-padding">
      <IonGrid>
        <IonRow>
          <IonCol>
            <Button isIconOnly variant="flat" color="warning"
                    as={Link}
                    href="/login"
            >
              <IonIcon icon={batteryHalf}></IonIcon>
            </Button>
          </IonCol>

          <IonCol>
            <Button isIconOnly variant="flat" color="warning"
                    as={Link}
                    href="/control"
            >
              <IonIcon icon={navigateCircle}></IonIcon>
            </Button>
          </IonCol>
          <IonCol>3</IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
}

export default DashboardTemplate;