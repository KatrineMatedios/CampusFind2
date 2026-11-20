import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, IdCard, KeyRound } from "lucide-react";
import { forgotPassword } from "@/services/authService";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/format";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await forgotPassword(identifier);
      navigate("/check-email", {
        state: { identifier, email: response.email },
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-brand-sand/70 bg-white p-5 shadow-sm">
      <Link
        to="/login"
        className="mb-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 hover:text-brand-brown"
      >
        <ArrowLeft size={14} />
        Back to Login
      </Link>

      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-sand/70 text-brand-brown">
        <KeyRound size={21} />
      </span>
      <h1 className="text-2xl font-bold leading-tight text-stone-800">
        Forgot your password?
      </h1>
      <p className="mt-1 text-xs leading-relaxed text-stone-500">
        Enter your Student ID or student email and we&apos;ll send a reset link to
        your inbox.
      </p>

      {error ? (
        <Alert variant="error" className="mt-4">
          {error}
        </Alert>
      ) : null}

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Student ID or Email"
          placeholder="2024-00123 or you@university.edu"
          icon={<IdCard size={16} />}
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          required
        />
        <Button type="submit" fullWidth loading={submitting}>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-4 text-center text-[10px] leading-relaxed text-stone-400">
        Still having trouble? Contact the registrar or the Campus Lost &amp; Found
        Desk.
      </p>
    </div>
  );
}
