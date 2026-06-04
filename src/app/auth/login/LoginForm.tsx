"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

interface LoginFormProps {
  onSwitchToForgotPassword?: () => void;
}

function InputIcon({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
      <Icon className="h-4 w-4 text-cool-grey/60" />
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm font-medium text-slate/90">{label}</Label>
      {children}
    </div>
  );
}

export function LoginForm({ onSwitchToForgotPassword }: LoginFormProps = {}) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const user = session.user as { role?: string };
      const dest = callbackUrl || (user.role === "admin" ? "/admin" : "/dashboard");
      router.push(dest);
    }
  }, [session, callbackUrl, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (!result?.ok) {
      if (result?.error === "RATE_LIMITED") {
        setError("Too many login attempts. Please wait 10 minutes before trying again.");
      } else {
        setError("Invalid email or password.");
      }
      setIsLoading(false);
      return;
    }
  }

  return (
    <>
      <div className="rounded-2xl bg-pure-white px-7 py-8 shadow-xl shadow-slate-200/50 border border-slate-100">
        <h1 className="text-xl font-bold text-deep-navy mb-1">Sign in</h1>
        <p className="text-sm text-cool-grey mb-6">Access your facility&apos;s discharge dashboard.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email" id="email">
              <div className="relative">
                <InputIcon icon={Mail} />
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoCapitalize="off"
                  placeholder="clinician@hospital.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  enterKeyHint="next"
                  className="pl-10 h-11"
                />
              </div>
            </Field>

            <Field label="Password" id="password">
              <div className="relative">
                <InputIcon icon={Lock} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
              <div className="flex justify-end pt-0.5">
                <button type="button" onClick={onSwitchToForgotPassword} className="text-xs font-medium text-clinical-teal hover:text-clinical-teal/80 transition-colors">
                  Forgot password?
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
                  Signing in...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-cool-grey">
          New hospital or clinic?{" "}
          <Link href="/register-facility" className="font-medium text-clinical-teal hover:text-clinical-teal/80 transition-colors">
            Register your facility
          </Link>
        </p>

        <p className="mt-3 text-xs text-warm-amber leading-relaxed text-center">
          By continuing, you consent to the processing of patient data in accordance with NDPR 2019.
        </p>
    </>
  );
}
