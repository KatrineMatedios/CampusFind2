import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "lost"
  | "found"
  | "progress"
  | "resolved"
  | "brown"
  | "neutral"
  | "success"
  | "danger";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  lost: "bg-[#F8D7D7] text-[#9B2C2C]",
  found: "bg-[#CDE8C8] text-[#2F6B2A]",
  progress: "bg-[#F3C9C9] text-[#8C3A3A]",
  resolved: "bg-[#E7E2D3] text-[#6B6350]",
  brown: "bg-brand-brown text-white",
  neutral: "bg-stone-100 text-stone-600",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-700",
};

export default function Badge({
  children,
  variant = "neutral",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide",
        variants[variant],
        className,
      )}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
