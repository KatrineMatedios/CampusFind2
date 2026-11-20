import { useEffect, useState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import * as adminService from "@/services/adminService";
import * as profileService from "@/services/profileService";
import { getErrorMessage } from "@/lib/format";
import { useAuth } from "@/components/auth/AuthProvider";
import type { SettingsMap } from "@/types/admin";

const SETTINGS_FIELDS: Array<{ key: string; label: string; hint?: string; type?: "text" | "number" | "select" }> = [
  { key: "platform_name", label: "Platform name" },
  { key: "contact_email", label: "Contact email", type: "text" },
  { key: "allow_public_claims", label: "Allow public claims", type: "select", hint: "Whether any user can submit an ownership claim." },
  { key: "auto_approve_items", label: "Auto-approve reports", type: "select", hint: "New reports go live immediately." },
  { key: "max_photo_size_mb", label: "Max photo size (MB)", type: "number" },
  { key: "maintenance_mode", label: "Maintenance mode", type: "select", hint: "When on, the platform shows a maintenance banner." },
];

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Admin profile edit
  const [profile, setProfile] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    contact_number: user?.contact_number ?? "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminService
      .getSettings()
      .then((data) => {
        if (active) setSettings(data);
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
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        contact_number: user.contact_number ?? "",
      });
    }
  }, [user]);

  async function saveSettings() {
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      const result = await adminService.saveSettings(settings);
      setSettings(result.data);
      setSuccess(result.message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile() {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      await profileService.updateProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        contact_number: profile.contact_number || null,
      });
      await refreshUser();
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setProfileSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label="Loading settings…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-stone-800 lg:text-2xl">System Settings</h2>
        <p className="mt-1 text-xs text-stone-500 lg:text-sm">
          Manage platform configuration and your administrator profile.
        </p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      {/* Platform settings */}
      <section className="rounded-2xl border border-brand-sand/80 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-sm font-bold text-stone-800">Platform settings</h3>
        <p className="mt-1 text-xs text-stone-500">Update global configuration for CampusFind.</p>

        {success ? (
          <Alert variant="success" className="mt-4">
            {success}
          </Alert>
        ) : null}

        <div className="mt-4 space-y-4">
          {SETTINGS_FIELDS.map((field) => {
            const value = settings[field.key] ?? "";
            if (field.type === "select") {
              return (
                <div key={field.key} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700">{field.label}</label>
                  <select
                    value={value}
                    onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/15"
                  >
                    <option value="1">On</option>
                    <option value="0">Off</option>
                  </select>
                  {field.hint ? <p className="text-xs text-stone-500">{field.hint}</p> : null}
                </div>
              );
            }
            return (
              <Input
                key={field.key}
                label={field.label}
                type={field.type === "number" ? "number" : "text"}
                value={value}
                hint={field.hint}
                onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
              />
            );
          })}
        </div>

        <div className="mt-5 flex justify-end">
          <Button loading={saving} onClick={() => void saveSettings()}>
            Save settings
          </Button>
        </div>
      </section>

      {/* Admin profile */}
      <section className="rounded-2xl border border-brand-sand/80 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-sm font-bold text-stone-800">Administrator profile</h3>
        <p className="mt-1 text-xs text-stone-500">Update your name, email, and contact details.</p>

        {profileError ? (
          <Alert variant="error" className="mt-4">
            {profileError}
          </Alert>
        ) : null}
        {profileSuccess ? (
          <Alert variant="success" className="mt-4">
            {profileSuccess}
          </Alert>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="First name"
            value={profile.first_name}
            onChange={(e) => setProfile((p) => ({ ...p, first_name: e.target.value }))}
          />
          <Input
            label="Last name"
            value={profile.last_name}
            onChange={(e) => setProfile((p) => ({ ...p, last_name: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
          />
          <Input
            label="Contact number"
            value={profile.contact_number}
            onChange={(e) => setProfile((p) => ({ ...p, contact_number: e.target.value }))}
          />
        </div>

        <div className="mt-5 flex justify-end">
          <Button loading={profileSaving} onClick={() => void saveProfile()}>
            Save profile
          </Button>
        </div>
      </section>
    </div>
  );
}
