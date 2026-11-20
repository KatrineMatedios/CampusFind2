import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  to?: string;
  compact?: boolean;
  inverted?: boolean;
  className?: string;
}

export default function BrandLogo({
  to = "/",
  compact = false,
  inverted = false,
  className,
}: BrandLogoProps) {
  const content = (
    <>
      <span
        className={cn(
          "flex items-center justify-center rounded-xl shadow-sm",
          compact ? "h-8 w-8 rounded-lg" : "h-11 w-11",
          inverted
            ? "bg-white text-brand-brown"
            : "bg-brand-brown text-brand-cream",
        )}
      >
        <Search size={compact ? 16 : 21} strokeWidth={2.5} />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-bold tracking-tight",
            compact ? "text-sm" : "text-lg",
            inverted ? "text-white" : "text-stone-800",
          )}
        >
          CampusFind
        </span>
        {!compact ? (
          <span
            className={cn(
              "mt-1 block text-[10px] font-medium uppercase tracking-[0.2em]",
              inverted ? "text-white/60" : "text-stone-400",
            )}
          >
            Lost &amp; Found
          </span>
        ) : null}
      </span>
    </>
  );

  if (!to) {
    return <div className={cn("flex items-center gap-2.5", className)}>{content}</div>;
  }

  return (
    <Link to={to} className={cn("flex items-center gap-2.5", className)}>
      {content}
    </Link>
  );
}
