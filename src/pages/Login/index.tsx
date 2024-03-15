import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { FC } from "react";
import { useParams } from "react-router";

import LoginTemplate from "@/components/templates/LoginTemplate/LoginTemplate";

const Login: FC = () => {
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

          <LoginTemplate></LoginTemplate>

        </IonContent>
      </IonPage>
  );
};

export default Login;
