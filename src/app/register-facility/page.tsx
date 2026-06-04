"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building, User, Mail, Lock, CheckCircle, ArrowRight, Eye, EyeOff } from "lucide-react";

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm font-medium text-slate/90">{label}</Label>
      {children}
    </div>
  );
}

export default function RegisterFacilityPage() {
  const router = useRouter();
  const [facilityName, setFacilityName] = useState("");
  const [facilityCode, setFacilityCode] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/facilities/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilityName,
          facilityCode: facilityCode || undefined,
          adminName,
          adminEmail,
          adminPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => router.push("/auth"), 3000);
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <AuthShell>
        <div className="rounded-2xl bg-pure-white p-8 shadow-xl shadow-slate-200/60 border border-slate-100 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-clinical-teal/10 mb-5">
            <CheckCircle className="h-8 w-8 text-clinical-teal" />
          </div>
          <h1 className="text-xl font-bold text-deep-navy">Facility registered</h1>
          <p className="mt-1.5 text-sm text-cool-grey">
            Your facility has been created. You can now sign in as the administrator.
          </p>
          <div className="mt-6 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-2/3 rounded-full bg-clinical-teal animate-pulse" />
          </div>
          <p className="mt-3 text-xs text-cool-grey">Redirecting to sign in...</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell variant="facility">
        <div className="rounded-2xl bg-pure-white px-7 py-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">

            <Field label="Facility name" id="facilityName">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Building className="h-4 w-4 text-cool-grey/60" />
                </div>
                <Input
                  id="facilityName"
                  type="text"
                  placeholder="e.g. Kano General Hospital"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  required
                  autoComplete="organization"
                  enterKeyHint="next"
                  className="pl-10 h-11"
                />
              </div>
            </Field>

            <Field label="Facility code (optional)" id="facilityCode">
              <Input
                id="facilityCode"
                type="text"
                placeholder="e.g. KGH-001"
                value={facilityCode}
                onChange={(e) => setFacilityCode(e.target.value)}
                autoComplete="off"
                enterKeyHint="next"
                className="h-11"
              />
            </Field>

            <hr className="border-slate/10" />

            <Field label="Admin full name" id="adminName">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="h-4 w-4 text-cool-grey/60" />
                </div>
                <Input
                  id="adminName"
                  type="text"
                  placeholder="e.g. Dr. Ali Suleiman"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                  autoComplete="name"
                  enterKeyHint="next"
                  className="pl-10 h-11"
                />
              </div>
            </Field>

            <Field label="Admin email" id="adminEmail">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4 w-4 text-cool-grey/60" />
                </div>
                <Input
                  id="adminEmail"
                  type="email"
                  inputMode="email"
                  autoCapitalize="off"
                  placeholder="admin@hospital.ng"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  autoComplete="email"
                  enterKeyHint="next"
                  className="pl-10 h-11"
                />
              </div>
            </Field>

            <Field label="Admin password" id="adminPassword">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4 text-cool-grey/60" />
                </div>
                <Input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  enterKeyHint="done"
                  className="pl-10 pr-10 h-11"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cool-grey/60 hover:text-cool-grey transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {error && (
              <Alert variant="destructive" className="rounded-lg border-red-200 bg-red-50 text-red-700 py-2.5">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-clinical-teal text-white text-sm font-bold hover:bg-clinical-teal/90 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-clinical-teal/20 transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Registering facility...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Register facility
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-5 space-y-2 text-center text-sm text-cool-grey">
          <p>
            Already registered?{" "}
            <Link href="/auth" className="font-medium text-clinical-teal hover:text-clinical-teal/80 transition-colors">
              Sign in
            </Link>
          </p>
          <p>
            Part of an existing facility?{" "}
            <Link href="/auth" className="font-medium text-clinical-teal hover:text-clinical-teal/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-5 text-xs text-warm-amber leading-relaxed text-center">
          By continuing, you consent to the processing of patient data in accordance with NDPR 2019.
        </p>
    </AuthShell>
  );
}
