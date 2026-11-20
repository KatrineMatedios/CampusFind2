import { Link } from "react-router-dom";
import { Compass, Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-6 text-center">
      <div className="relative mb-5">
        <span className="flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-brown text-brand-cream shadow-xl shadow-brand-brown/20">
          <Compass size={42} />
        </span>
        <span className="absolute -right-2 -top-2 rounded-full bg-brand-sand px-2 py-1 text-[10px] font-bold text-brand-brown">
          404
        </span>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Page not found</h1>
      <p className="mt-2 max-w-xs text-xs leading-relaxed text-stone-500">
        The page you are looking for may have moved, or the item link is no longer
        available.
      </p>
      <div className="mt-6 flex gap-2.5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-brown px-4 py-2.5 text-xs font-semibold text-white"
        >
          <Home size={14} /> Go Home
        </Link>
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-brown/20 bg-white px-4 py-2.5 text-xs font-semibold text-brand-brown"
        >
          <Search size={14} /> Browse Items
        </Link>
      </div>
    </div>
  );
}
