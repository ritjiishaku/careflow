"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "./login/LoginForm";
import { ForgotPasswordForm } from "./forgot-password/ForgotPasswordForm";
import { ResetPasswordForm } from "./forgot-password/ResetPasswordForm";

type AuthView = "login" | "forgot-password" | "reset-password";

function AuthContent() {
  const searchParams = useSearchParams();
  const initialView = (searchParams.get("view") as AuthView) || "login";
  const [view, setView] = useState<AuthView>(initialView);

  return (
    <AuthShell>
      {view === "login" && (
        <LoginForm onSwitchToForgotPassword={() => setView("forgot-password")} />
      )}
      {view === "forgot-password" && (
        <ForgotPasswordForm onSwitchToLogin={() => setView("login")} />
      )}
      {view === "reset-password" && (
        <ResetPasswordForm onSwitchToLogin={() => setView("login")} />
      )}
    </AuthShell>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex h-dvh items-center justify-center bg-cool-off-white p-4">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
