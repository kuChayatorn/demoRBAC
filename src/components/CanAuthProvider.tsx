"use client";
import React from "react";
import { useAuth } from "../provider/Auth.provider";
import { CanProvider } from "../provider/Can.provider";

const CanAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return <CanProvider role={user?.role || "user"}>{children}</CanProvider>;
};

export default CanAuthProvider;
