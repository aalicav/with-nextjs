"use client"
import { AuthPage as RefineAuthPage, ThemedTitleV2 } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";

export const AuthPage = ({ type }: { type: "login" | "register" | "forgotPassword" }) => {
  const { data: user } = useGetIdentity<{ roles: string[] }>();

  if (type === "register" && (!user || !user.roles.includes("admin"))) {
    return <div>Acesso não autorizado</div>;
  }

  return (
    <RefineAuthPage
      type={type}
      title={<ThemedTitleV2 collapsed icon={<img src="" />} />}  
    />
  );
};