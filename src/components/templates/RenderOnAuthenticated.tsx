import UserService from "@/core/services/UserService";
import React, { ReactNode } from "react";

interface RenderOnAuthenticatedProps {
  children: ReactNode;
}

const RenderOnAuthenticated: React.FC<RenderOnAuthenticatedProps> = ({ children }) => {
  return UserService.isLoggedIn() ? <>{children}</> : null;
};

export default RenderOnAuthenticated;