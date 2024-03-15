import { IonContent } from "@ionic/react";
import UserService from "@/core/services/UserService";

function LoginTemplate() {

  return (
    <IonContent>
      {UserService.isLoggedIn() ? (
        <p>aaa</p>
      ): (
        <p>aaa1</p>
      )}
      <button className="btn btn-lg btn-success" onClick={() => UserService.doLogin()}>Login</button>
    </IonContent>
  );
}

export default LoginTemplate;