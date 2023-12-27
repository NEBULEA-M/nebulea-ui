import { IonButtons, IonContent, IonHeader, IonInput, IonItem, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React, { useRef } from "react";

import ButtonCommon from "@/components/atoms/Button";

const Modal = ({
                 onDismiss
               }: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const inputRef = useRef<HTMLIonInputElement>(null);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <ButtonCommon color="medium" onClick={() => onDismiss(null, "cancel")}>
              Cancel
            </ButtonCommon>
          </IonButtons>
          <IonTitle>Welcome</IonTitle>
          <IonButtons slot="end">
            <ButtonCommon onClick={() => onDismiss(inputRef.current?.value, "confirm")} strong={true}>
              Confirm
            </ButtonCommon>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput ref={inputRef} labelPlacement="stacked" label="Enter your name" placeholder="Your name" />
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default React.memo(Modal);