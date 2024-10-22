import React, { ReactNode } from "react";

import UserService from "@/core/services/UserService";

interface RenderOnAuthenticatedProps {
  children: ReactNode;
}

const RenderOnAuthenticated: React.FC<RenderOnAuthenticatedProps> = ({ children }) => {
  return UserService.isLoggedIn() ? <>{children}</> : null;
};

export default RenderOnAuthenticated;
