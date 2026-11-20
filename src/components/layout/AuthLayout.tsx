import { Outlet } from "react-router-dom";
import { CheckCircle2, Search, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

const highlights = [
  "Report lost or found items in seconds",
  "Verify ownership and claim found items",
  "Track every update from a single dashboard",
];

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-cream lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-sand/70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-brand-sand/50"
        aria-hidden="true"
      />

      <aside className="relative hidden overflow-hidden bg-brand-brown p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-white/5"
          aria-hidden="true"
        />

        <div className="relative">
          <BrandLogo inverted />
        </div>

        <div className="relative max-w-md">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
            <Search size={24} strokeWidth={2.5} />
          </span>
          <h2 className="mt-6 text-4xl font-bold leading-tight">
            Never lose track of what matters on campus.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            CampusFind connects students with the Lost &amp; Found Desk, making it
            easier to report, find, and reclaim belongings.
          </p>

          <ul className="mt-8 space-y-3">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-3 text-sm text-white/85">
                <CheckCircle2 size={18} className="shrink-0 text-white/60" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-2 text-[11px] text-white/50">
          <ShieldCheck size={14} /> A safer way to reunite students with their belongings.
        </div>
      </aside>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-7 lg:max-w-none lg:justify-center lg:px-12">
        <header className="mb-6 lg:hidden">
          <BrandLogo />
        </header>

        <main className="flex flex-1 flex-col justify-center pb-6 lg:flex-none lg:pb-0">
          <div className="lg:mx-auto lg:w-full lg:max-w-md">
            <Outlet />
          </div>
        </main>

        <footer className="pt-4 text-center text-[10px] text-stone-400">
          CampusFind · Student Lost &amp; Found System
        </footer>
      </div>
    </div>
  );
}
