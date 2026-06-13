"use client";

import { use } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DischargeOutputView } from "@/app/dashboard/DischargeOutputView";

export default function DischargeOutputPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AppShell hideSidebar>
      <DischargeOutputView id={id} />
    </AppShell>
  );
}
