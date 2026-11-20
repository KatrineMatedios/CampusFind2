import { useEffect, useState } from "react";
import { Search, Trash2, UserPlus, Users as UsersIcon } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/components/auth/AuthProvider";
import * as adminService from "@/services/adminService";
import { getErrorMessage } from "@/lib/format";
import type { AdminListMeta, AdminUser, AdminUserPayload } from "@/types/admin";
import type { UserRole } from "@/types/user";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "staff", label: "Staff" },
  { value: "admin", label: "Admin" },
];

const emptyForm: AdminUserPayload = {
  first_name: "",
  last_name: "",
  student_id: "",
  email: "",
  college_program: "",
  contact_number: "",
  role: "student",
  password: "",
};

function roleBadgeVariant(role: UserRole): "brown" | "success" | "neutral" {
  if (role === "admin") return "brown";
  if (role === "staff") return "success";
  return "neutral";
}

export default function UsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<AdminListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<AdminUserPayload>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await adminService.getUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        page,
        per_page: 10,
      });
      setUsers(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, statusFilter, page]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(user: AdminUser) {
    setEditing(user);
    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      student_id: user.student_id,
      email: user.email,
      college_program: user.college_program ?? "",
      contact_number: user.contact_number ?? "",
      role: user.role,
      password: "",
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload: AdminUserPayload = { ...form };
      if (!payload.password) delete payload.password;
      if (editing) {
        await adminService.updateUser(editing.id, payload);
      } else {
        if (!payload.password) {
          setFormError("Password is required when creating an account.");
          setSaving(false);
          return;
        }
        await adminService.createUser(payload);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(user: AdminUser) {
    try {
      await adminService.updateUserStatus(user.id, !user.is_active);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-800 lg:text-2xl">User Management</h2>
          <p className="mt-1 text-xs text-stone-500 lg:text-sm">
            View, create, edit, and deactivate campus accounts.
          </p>
        </div>
        <Button onClick={openCreate} leftIcon={<UserPlus size={16} />}>
          Add User
        </Button>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          placeholder="Search users by name, email, or ID..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          icon={<Search size={15} />}
        />
        <Select
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.target.value as UserRole | "");
            setPage(1);
          }}
          placeholder="All roles"
          options={ROLE_OPTIONS}
        />
        <Select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value as "active" | "inactive" | "");
            setPage(1);
          }}
          placeholder="All statuses"
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Loading users…" />
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={<UsersIcon size={22} />}
          title="No users found"
          description="Try a different search or filter, or add a new account."
          action={
            <Button onClick={openCreate} size="sm" leftIcon={<UserPlus size={14} />}>
              Add User
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-sand/80 bg-white shadow-sm">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-brand-sand/70 bg-brand-cream/60 text-[11px] uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Student ID</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-sand/40">
              {users.map((u) => {
                const isSelf = me?.id === u.id;
                return (
                  <tr key={u.id} className="transition hover:bg-brand-cream/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.full_name} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-stone-800">{u.full_name}</p>
                          <p className="truncate text-[11px] text-stone-500">{u.college_program ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-stone-700">{u.student_id}</td>
                    <td className="px-4 py-3 text-xs text-stone-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={roleBadgeVariant(u.role)}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.is_active ? "success" : "danger"}>
                        {u.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(u)}
                          aria-label={`Edit ${u.full_name}`}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleStatus(u)}
                          disabled={isSelf}
                          aria-label={`${u.is_active ? "Deactivate" : "Activate"} ${u.full_name}`}
                        >
                          {u.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteTarget(u)}
                          disabled={isSelf}
                          aria-label={`Delete ${u.full_name}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 ? (
        <div className="flex items-center justify-between text-xs text-stone-600">
          <span>
            Page {meta.current_page} of {meta.last_page} ({meta.total} users)
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={meta.current_page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {/* Add/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit User" : "Add User"}
        subtitle={editing ? "Update account details and permissions." : "Create a new campus account."}
        size="lg"
      >
        {formError ? (
          <Alert variant="error" className="mb-4">
            {formError}
          </Alert>
        ) : null}
        <form onSubmit={submitForm} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="First name"
              value={form.first_name}
              onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
              required
            />
            <Input
              label="Last name"
              value={form.last_name}
              onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Student ID"
              value={form.student_id}
              onChange={(e) => setForm((f) => ({ ...f, student_id: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="College program"
              value={form.college_program ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, college_program: e.target.value }))}
            />
            <Input
              label="Contact number"
              value={form.contact_number ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, contact_number: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="Role"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
              options={ROLE_OPTIONS}
            />
            <Input
              label={editing ? "New password (optional)" : "Password"}
              type="password"
              value={form.password ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required={!editing}
              minLength={8}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "Save changes" : "Create account"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete account"
        subtitle="This action cannot be undone."
        size="sm"
      >
        <p className="text-sm text-stone-600">
          Are you sure you want to delete{" "}
          <span className="font-bold text-stone-800">{deleteTarget?.full_name}</span>? All of their
          reports and activity will be removed.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button type="button" variant="danger" loading={deleting} onClick={() => void confirmDelete()}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
