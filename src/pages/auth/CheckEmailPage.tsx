import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, MailCheck } from "lucide-react";
import { forgotPassword } from "@/services/authService";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/format";

interface CheckEmailState {
  identifier?: string;
  email?: string;
}

export default function CheckEmailPage() {
  const location = useLocation();
  const state = (location.state as CheckEmailState | null) ?? {};
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    if (!state.identifier) return;
    setError("");
    setSending(true);
    try {
      await forgotPassword(state.identifier);
      setResent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-3xl border border-brand-sand/70 bg-white p-6 text-center shadow-sm">
      <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-sand/60 text-brand-brown">
        <MailCheck size={30} />
      </span>
      <h1 className="text-2xl font-bold text-stone-800">Check your email</h1>
      <p className="mt-2 text-xs leading-relaxed text-stone-500">
        We sent a password reset link
        {state.email ? (
          <>
            {" "}
            to <span className="font-semibold text-stone-700">{state.email}</span>
          </>
        ) : (
          " to your student email"
        )}
        . The link expires soon, so use it right away.
      </p>

      {resent ? (
        <Alert variant="success" className="mt-4 text-left">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} /> A new reset link has been sent.
          </span>
        </Alert>
      ) : null}
      {error ? (
        <Alert variant="error" className="mt-4 text-left">
          {error}
        </Alert>
      ) : null}

      <div className="mt-6 space-y-2.5">
        <Button
          type="button"
          fullWidth
          variant="secondary"
          onClick={handleResend}
          loading={sending}
          disabled={!state.identifier || resent}
        >
          Resend Link
        </Button>
        <Link
          to="/login"
          className="block w-full rounded-xl border border-brand-brown/20 px-4 py-3 text-sm font-semibold text-brand-brown transition hover:bg-brand-cream"
        >
          Back to Login
        </Link>
      </div>

      <p className="mt-4 text-[10px] leading-relaxed text-stone-400">
        Didn&apos;t receive it? Check your spam folder or contact the registrar.
      </p>
    </div>
  );
}
