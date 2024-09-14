import { authProviderServer } from "@providers/auth-provider";
import { ThemedLayoutV2 } from "@refinedev/antd";
import { Header } from "@components/header";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import LoadingPage from "@/components/LoadingPage";

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();

  if (!data.authenticated) {
    return redirect(data?.redirectTo || "/login");
  }

  return (
    <ThemedLayoutV2 Header={Header}>
      <Suspense fallback={<LoadingPage />}>
        {children}
      </Suspense>
    </ThemedLayoutV2>
  );
}

async function getData() {
  const { authenticated, redirectTo } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
  };
}