import { useState } from "react";
import {
  ChevronDown,
  CircleHelp,
  Clock,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
} from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I claim a found item?",
    answer:
      "Open Found Items, tap “This is Mine” on the matching item, and describe unique details only the owner would know. You can also upload photo proof. Once submitted, your claim is reviewed by the Lost & Found Desk.",
  },
  {
    question: "Where do I pick up my claimed item?",
    answer:
      "Bring your claim QR code and a valid student ID to the pickup location you selected. The Campus Lost & Found Desk is on the ground floor of the Student Affairs Office, open Monday to Friday, 8:00 AM to 5:00 PM.",
  },
  {
    question: "How long does claim verification take?",
    answer:
      "Most claims are reviewed within one to two school days. You will receive a notification once your claim is confirmed, rejected, or marked as collected.",
  },
  {
    question: "What if my item is not on the list?",
    answer:
      "Report the item as lost so the campus community can watch for it. Check back regularly and enable notifications. New found items are added throughout the day.",
  },
  {
    question: "Can I edit or delete my report?",
    answer:
      "Yes. Open My Reports, select the item, and update the details from the report. If the item has already been claimed, contact the Lost & Found Desk before making changes.",
  },
  {
    question: "What should I do if someone contacts me about my lost item?",
    answer:
      "Meet in a public campus area such as the library lobby or the Lost & Found Desk. Never send money or share passwords. If anything feels suspicious, report it to campus security.",
  },
];

export default function HelpSupportPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Help & Support"
        subtitle="Find answers or reach the Lost & Found team."
        showBack
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
        <div>
          <Input
            type="search"
            placeholder="Search frequently asked questions…"
            icon={<Search size={16} />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search FAQs"
          />

          <section className="mt-4">
            <h2 className="mb-2.5 text-sm font-bold text-stone-800">
              Frequently Asked Questions
            </h2>

            {filtered.length === 0 ? (
              <EmptyState
                icon={<CircleHelp size={22} />}
                title="No matching answers"
                description="Try a different keyword, or contact us directly below."
              />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-brand-sand/80 bg-white shadow-sm">
                {filtered.map((faq, index) => {
                  const open = openIndex === index;
                  return (
                    <div
                      key={faq.question}
                      className={index > 0 ? "border-t border-brand-sand/60" : ""}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIndex(open ? null : index)}
                        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                        aria-expanded={open}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-sand/50 text-[10px] font-bold text-brand-brown">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-xs font-semibold text-stone-700">
                          {faq.question}
                        </span>
                        <ChevronDown
                          size={15}
                          className={cn(
                            "shrink-0 text-stone-400 transition-transform",
                            open && "rotate-180",
                          )}
                        />
                      </button>
                      {open ? (
                        <p className="px-4 pb-4 pl-14 text-[11px] leading-relaxed text-stone-500">
                          {faq.answer}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <section>
            <h2 className="mb-2.5 text-sm font-bold text-stone-800">Contact Us</h2>
            <div className="space-y-2.5">
              <a
                href="mailto:lostandfound@university.edu"
                className="flex items-center gap-3 rounded-2xl border border-brand-sand/80 bg-white p-3.5 shadow-sm transition hover:bg-brand-cream"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-sand/60 text-brand-brown">
                  <Mail size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-stone-800">
                    Email Support
                  </span>
                  <span className="block text-[10px] text-stone-500">
                    lostandfound@university.edu
                  </span>
                </span>
                <span className="text-[10px] font-semibold text-brand-brown">Write →</span>
              </a>

              <a
                href="tel:+639170000000"
                className="flex items-center gap-3 rounded-2xl border border-brand-sand/80 bg-white p-3.5 shadow-sm transition hover:bg-brand-cream"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-sand/60 text-brand-brown">
                  <Phone size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-stone-800">Call Office</span>
                  <span className="block text-[10px] text-stone-500">+63 917 000 0000</span>
                </span>
                <span className="text-[10px] font-semibold text-brand-brown">Call →</span>
              </a>
            </div>
          </section>

          <section className="rounded-2xl bg-brand-brown p-4 text-white">
            <div className="flex items-start gap-2">
              <MapPin size={17} className="mt-0.5 shrink-0 text-white/70" />
              <div>
                <p className="text-xs font-bold">Campus Lost &amp; Found Desk</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-white/70">
                  Ground Floor, Student Affairs Office · Main Campus
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
              <Clock size={13} className="text-white/70" />
              <p className="text-[10px] text-white/80">Mon–Fri · 8:00 AM – 5:00 PM</p>
            </div>
          </section>

          <p className="flex items-center justify-center gap-1.5 text-center text-[10px] text-stone-400">
            <ShieldCheck size={12} /> CampusFind keeps your student details private.
          </p>
        </div>
      </div>
    </div>
  );
}
