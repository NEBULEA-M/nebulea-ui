import { IonCol, IonContent, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { batteryHalf } from "ionicons/icons";

function DashboardTemplate(props: any) {
  return (
    <IonContent class="ion-padding">
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonIcon icon={batteryHalf}></IonIcon>
          </IonCol>
          <IonCol>2</IonCol>
          <IonCol>3</IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  )
}

export default DashboardTemplate;