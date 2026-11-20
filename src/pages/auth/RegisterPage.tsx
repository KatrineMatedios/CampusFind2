import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Hash, IdCard, Lock, Mail, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/format";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    student_id: "",
    password: "",
    confirm_password: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    const parts = form.full_name.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ") || "Student";

    setSubmitting(true);
    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email: form.email,
        student_id: form.student_id,
        password: form.password,
        password_confirmation: form.confirm_password,
        terms_accepted: form.terms,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-brand-sand/70 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-sand/70 text-brand-brown">
          <UserRound size={21} />
        </span>
        <h1 className="text-2xl font-bold leading-tight text-stone-800">
          Create your account
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-stone-500">
          Use your official student details so the Lost &amp; Found Desk can verify
          your claims.
        </p>
      </div>

      {error ? (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      ) : null}

      <form className="space-y-3.5" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          placeholder="Maria Santos"
          autoComplete="name"
          icon={<UserRound size={16} />}
          value={form.full_name}
          onChange={(event) => update("full_name", event.target.value)}
          required
        />
        <Input
          label="Student Email"
          type="email"
          placeholder="you@university.edu"
          autoComplete="email"
          icon={<Mail size={16} />}
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          required
        />
        <Input
          label="Student ID Number"
          placeholder="2024-00123"
          icon={<IdCard size={16} />}
          value={form.student_id}
          onChange={(event) => update("student_id", event.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          icon={<Lock size={16} />}
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
          minLength={8}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          icon={<Hash size={16} />}
          value={form.confirm_password}
          onChange={(event) => update("confirm_password", event.target.value)}
          minLength={8}
          required
        />

        <label className="flex items-start gap-2.5 rounded-xl bg-brand-cream p-3 text-[11px] leading-relaxed text-stone-600">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(event) => update("terms", event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-brand-brown"
            required
          />
          <span>
            I agree to the{" "}
            <span className="font-semibold text-brand-brown">Terms &amp; Conditions</span>{" "}
            and understand that false ownership claims may be reported to Student
            Affairs.
          </span>
        </label>

        <Button type="submit" fullWidth loading={submitting}>
          Create Account
        </Button>
      </form>

      <p className="mt-4 text-center text-[11px] text-stone-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-brown hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
