import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { FC } from "react";
import { useParams } from "react-router";

import ControlTemplate from "@/components/templates/ControlTemplate/ControlTemplate";

const Control: FC = () => {
  const { name } = useParams<{ name: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ControlTemplate
          ros2ConnectionUrl={"ws://localhost:9091/event-emitter"}
          topicName={"/turtle1/cmd_vel"}
        />
      </IonContent>
    </IonPage>
  );
};

export default Control;
