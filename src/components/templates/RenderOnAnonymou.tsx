import React, { ReactNode } from 'react';
import UserService from "@/core/services/UserService";

interface RenderOnAnonymousProps {
  children: ReactNode;
}

const RenderOnAnonymous: React.FC<RenderOnAnonymousProps> = ({ children }) => {
  return !UserService.isLoggedIn() ? <>{children}</> : null;
};

export default RenderOnAnonymous;