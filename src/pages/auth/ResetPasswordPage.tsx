import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, KeyRound, Lock } from "lucide-react";
import { resetPassword } from "@/services/authService";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/format";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({
        token,
        email,
        password,
        password_confirmation: confirmation,
      });
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-brand-sand/70 bg-white p-5 shadow-sm">
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-sand/70 text-brand-brown">
        <KeyRound size={21} />
      </span>
      <h1 className="text-2xl font-bold leading-tight text-stone-800">
        Set a new password
      </h1>
      <p className="mt-1 text-xs leading-relaxed text-stone-500">
        Choose a strong password for {email || "your student account"}.
      </p>

      {!token ? (
        <Alert variant="error" className="mt-4">
          This reset link is missing its token. Request a new link from the{" "}
          <Link to="/forgot-password" className="font-semibold underline">
            forgot password page
          </Link>
          .
        </Alert>
      ) : null}

      {error ? (
        <Alert variant="error" className="mt-4">
          {error}
        </Alert>
      ) : null}

      {success ? (
        <div className="mt-5 space-y-3 text-center">
          <Alert variant="success">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Password reset successfully.
            </span>
          </Alert>
          <Button type="button" fullWidth onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </div>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="New Password"
            type="password"
            placeholder="At least 8 characters"
            icon={<Lock size={16} />}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter your new password"
            icon={<Lock size={16} />}
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            minLength={8}
            required
          />
          <Button type="submit" fullWidth loading={submitting} disabled={!token}>
            Reset Password
          </Button>
          <Link
            to="/login"
            className="block text-center text-[11px] font-semibold text-stone-500 hover:text-brand-brown"
          >
            Back to Login
          </Link>
        </form>
      )}
    </div>
  );
}
