"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { DischargeOutputView } from "@/app/dashboard/DischargeOutputView";

export default function DischargeOutputPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-cool-off-white">
      <DischargeOutputView
        id={id}
        onNavigate={(v) => {
          if (v.name === "list") router.push("/dashboard");
          else if (v.name === "output" && v.id) router.push(`/discharge/${v.id}`);
        }}
      />
    </div>
  );
}
