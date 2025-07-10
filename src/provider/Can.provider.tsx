// providers/CanProvider.tsx
"use client";

import { createContext, useContext } from "react";
import { rolePermissions } from "../utils/permissions";
import { Action, Role } from "../types/role.type";

const CanContext = createContext<{
  can: (role: Role, action: Action, resource: string) => boolean ;
}>({
  can: () => false,
});

export const CanProvider = ({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) => {
  const can = (
    role: Role,
    action: Action,
    resource: string
  ): boolean => {
    const permissions = rolePermissions[role]?.can || {};
    return permissions[action]?.includes(resource) || false;
  };

  return <CanContext.Provider value={{ can }}>{children}</CanContext.Provider>;
};

export const useCan = () => useContext(CanContext);
