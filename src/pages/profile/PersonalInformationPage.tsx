import { useEffect, useRef, useState, type FormEvent } from "react";
import { Camera, CheckCircle2, IdCard, Loader2, Mail, Phone, School, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import Alert from "@/components/ui/Alert";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import { getErrorMessage } from "@/lib/format";
import { getProfile, updateAvatar, updateProfile } from "@/services/profileService";

export default function PersonalInformationPage() {
  const { user, setUser } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    student_id: "",
    college_program: "",
    email: "",
    contact_number: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    getProfile()
      .then((response) => {
        if (!active) return;
        const profile = response.data;
        setForm({
          first_name: profile.first_name,
          last_name: profile.last_name,
          student_id: profile.student_id,
          college_program: profile.college_program ?? "",
          email: profile.email,
          contact_number: profile.contact_number ?? "",
        });
        setAvatarUrl(profile.avatar_url);
        setUser(profile);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [setUser]);

  const update = (key: keyof typeof form, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleAvatar = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setSuccess("");
    setUploading(true);
    try {
      const response = await updateAvatar(file);
      setAvatarUrl(response.data.avatar_url);
      setUser(response.data);
      setSuccess("Profile photo updated.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await updateProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        college_program: form.college_program || null,
        contact_number: form.contact_number || null,
      });
      setUser(response.data);
      setSuccess("Personal information updated.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Personal Information"
        subtitle="Keep your student details up to date."
        showBack
      />

      {error ? <Alert variant="error" className="mb-4">{error}</Alert> : null}
      {success ? (
        <Alert variant="success" className="mb-4">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} /> {success}
          </span>
        </Alert>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:items-start lg:gap-5">
        <section className="flex flex-col items-center rounded-2xl border border-brand-sand/80 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <div className="relative">
          <Avatar
            src={avatarUrl}
            name={user?.full_name ?? "Student"}
            size="xl"
            className="ring-4 ring-brand-sand/60"
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-brown text-white shadow-md transition hover:bg-brand-brown-dark disabled:opacity-60"
            aria-label="Change photo"
          >
            {uploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Camera size={14} />
            )}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            onChange={(event) => handleAvatar(event.target.files?.[0])}
          />
        </div>
        <p className="mt-3 text-sm font-bold text-stone-800">{user?.full_name}</p>
        <p className="text-[11px] text-stone-400">{user?.college_program ?? "Student"}</p>
        </section>

        <div>
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl border border-brand-sand/80 bg-white"
            />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <section className="space-y-3.5 rounded-2xl border border-brand-sand/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-brand-sand/60 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-sand/60 text-brand-brown">
                <UserRound size={16} />
              </span>
              <p className="text-xs font-bold text-stone-800">Student details</p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
              <Input
                label="First Name"
                value={form.first_name}
                onChange={(event) => update("first_name", event.target.value)}
                required
              />
              <Input
                label="Last Name"
                value={form.last_name}
                onChange={(event) => update("last_name", event.target.value)}
                required
              />
              <Input
                label="Student ID"
                icon={<IdCard size={16} />}
                value={form.student_id}
                disabled
                hint="Contact the registrar if your Student ID is incorrect."
              />
              <Input
                label="College / Program"
                icon={<School size={16} />}
                placeholder="e.g. BS Computer Science"
                value={form.college_program}
                onChange={(event) => update("college_program", event.target.value)}
              />
              <Input
                label="Student Email"
                type="email"
                icon={<Mail size={16} />}
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                required
              />
              <Input
                label="Contact Number"
                type="tel"
                icon={<Phone size={16} />}
                placeholder="09XXXXXXXXX"
                value={form.contact_number}
                onChange={(event) => update("contact_number", event.target.value)}
              />
            </div>
          </section>

          <Button type="submit" fullWidth loading={saving}>
            Save Changes
          </Button>
        </form>
      )}
        </div>
      </div>
    </div>
  );
}
