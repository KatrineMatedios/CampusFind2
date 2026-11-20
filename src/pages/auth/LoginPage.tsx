import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IdCard, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/format";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await login({ identifier, password, remember });
      const destination =
        from !== "/" ? from : user.role === "admin" || user.role === "staff" ? "/admin" : "/";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-brand-sand/70 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-sand/70 text-brand-brown">
            <LogIn size={21} />
          </span>
          <h1 className="text-2xl font-bold leading-tight text-stone-800">
            Welcome back
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">
            Log in with your student ID or email to report and reclaim items.
          </p>
        </div>

        {error ? (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Student ID or Email"
            placeholder="2024-00123 or you@university.edu"
            autoComplete="username"
            icon={<IdCard size={16} />}
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            icon={<Lock size={16} />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-[11px] font-medium text-stone-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 rounded border-stone-300 accent-brand-brown"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-semibold text-brand-brown hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={submitting}>
            Log In
          </Button>
        </form>

        <p className="mt-4 text-center text-[11px] text-stone-500">
          New to CampusFind?{" "}
          <Link to="/register" className="font-semibold text-brand-brown hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <p className="px-2 text-center text-[10px] leading-relaxed text-stone-400">
        Students without an account should contact the registrar.
      </p>
    </div>
  );
}
