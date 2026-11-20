import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  action?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  action,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("mb-5 flex items-start gap-3 lg:mb-6", className)}>
      {showBack ? (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-brown shadow-sm ring-1 ring-brand-sand/70 transition hover:bg-brand-sand/40"
          aria-label="Go back"
        >
          <ArrowLeft size={17} />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold leading-tight text-stone-800 lg:text-2xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-xs text-stone-500 lg:text-sm">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
