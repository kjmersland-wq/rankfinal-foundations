import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";
import { signIn, signUp, signInWithGoogle } from "@/lib/auth";

export default function SignIn() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="amber">{mode === "signin" ? "Sign in" : "Create account"}</Badge>
          <h1 className="text-3xl font-extrabold text-text-primary">
            {mode === "signin" ? "Welcome back" : "Join RankFinal"}
          </h1>
          <p className="text-text-secondary">
            {mode === "signin"
              ? "Sign in to your account to continue"
              : "Create an account to get started"}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-input border border-border bg-surface px-4 py-3 text-sm font-bold text-text-primary transition-all hover:bg-background disabled:opacity-50"
          >
            <svg className="size-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-text-secondary">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-input border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent-amber focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full rounded-input border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent-amber focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-input border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            variant="amber"
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="w-full"
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign in →"
              : "Create account →"}
          </Button>
        </div>

        <p className="text-center text-sm text-text-secondary">
          {mode === "signin" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="font-bold text-accent-amber hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("signin")}
                className="font-bold text-accent-amber hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        <p className="text-center text-xs text-text-secondary">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-text-primary">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </PageWrapper>
  );
}
