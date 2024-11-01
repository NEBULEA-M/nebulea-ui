import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { FC } from "react";

import LoginTemplate from "@/components/templates/LoginTemplate/LoginTemplate";

const Login: FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <LoginTemplate></LoginTemplate>
      </IonContent>
    </IonPage>
  );
};

export default Login;
