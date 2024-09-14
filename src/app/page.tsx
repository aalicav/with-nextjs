"use client";

import { Suspense } from "react";
import { NavigateToResource } from "@refinedev/nextjs-router";
import { Authenticated } from "@refinedev/core";
import LoadingPage from "@/components/LoadingPage";

export default function IndexPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Authenticated key="home-page" fallback={<LoadingPage />}>
        <NavigateToResource />
      </Authenticated>
    </Suspense>
  );
}
