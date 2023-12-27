import styles from "./styles.module.scss";

import { IonContent, IonList, IonListHeader, IonMenu } from "@ionic/react";
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp } from "ionicons/icons";
import { useLocation } from "react-router-dom";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Inbox",
    url: "/folder/Inbox",
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    title: "Outbox",
    url: "/folder/Outbox",
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  }
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Inbox</IonListHeader>

          {/*{appPages.map((appPage, index) => {*/}
          {/*  return (*/}
          {/*    <IonMenuToggle key={index} autoHide={false}>*/}
          {/*      <IonItem*/}
          {/*        className={location.pathname === appPage.url ? "selected" : ""}*/}
          {/*        routerLink={appPage.url}*/}
          {/*        routerDirection="none"*/}
          {/*        lines="none"*/}
          {/*        detail={false}*/}
          {/*      >*/}
          {/*        <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />*/}
          {/*        <IonLabel>{appPage.title}</IonLabel>*/}
          {/*      </IonItem>*/}
          {/*    </IonMenuToggle>*/}
          {/*  );*/}
          {/*})}*/}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
