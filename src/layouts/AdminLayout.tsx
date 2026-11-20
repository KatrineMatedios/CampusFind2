import { useState, type FormEvent } from "react";
import { Outlet } from "react-router-dom";
import { Megaphone } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import * as adminService from "@/services/adminService";
import { getErrorMessage } from "@/lib/format";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [noticeError, setNoticeError] = useState<string | null>(null);
  const [noticeSuccess, setNoticeSuccess] = useState<string | null>(null);

  async function submitNotice(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setNoticeError(null);
    try {
      const result = await adminService.sendNotice({ title: title.trim(), message: message.trim() });
      setNoticeSuccess(result.message);
      setTitle("");
      setMessage("");
    } catch (error) {
      setNoticeError(getErrorMessage(error));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#f1e9d8]">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <AdminSidebar onCreateNotice={() => setNoticeOpen(true)} />
      </div>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[80%] max-w-xs shadow-2xl">
            <AdminSidebar onCreateNotice={() => setNoticeOpen(true)} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      ) : null}

      {/* Main column */}
      <div className="flex min-h-dvh flex-col lg:pl-64">
        <AdminHeader onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 px-4 pb-10 pt-5 lg:px-8 lg:pt-7">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
        <footer className="px-4 pb-6 text-center text-[11px] text-stone-400 lg:px-8">
          CampusFind Admin · Lost &amp; Found Management System
        </footer>
      </div>

      {/* Create notice modal */}
      <Modal
        open={noticeOpen}
        onClose={() => {
          setNoticeOpen(false);
          setNoticeError(null);
          setNoticeSuccess(null);
        }}
        title="Create Notice"
        subtitle="Send an announcement to every active user of the platform."
      >
        {noticeSuccess ? (
          <Alert variant="success" className="mb-4">
            {noticeSuccess}
          </Alert>
        ) : null}
        {noticeError ? (
          <Alert variant="error" className="mb-4">
            {noticeError}
          </Alert>
        ) : null}
        <form onSubmit={submitNotice} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Scheduled maintenance this weekend"
            maxLength={100}
            required
          />
          <Textarea
            label="Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write the announcement shown in every user's notifications."
            rows={4}
            maxLength={500}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setNoticeOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={sending} leftIcon={<Megaphone size={16} />}>
              Send Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
