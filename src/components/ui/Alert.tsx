import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "error" | "success" | "info";

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
}

const styles: Record<AlertVariant, { box: string; icon: ReactNode }> = {
  error: {
    box: "border-red-200 bg-red-50 text-red-700",
    icon: <AlertCircle size={16} />,
  },
  success: {
    box: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: <CheckCircle2 size={16} />,
  },
  info: {
    box: "border-brand-sand bg-brand-cream text-brand-brown",
    icon: <Info size={16} />,
  },
};

export default function Alert({ children, variant = "error", className }: AlertProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl border px-3.5 py-3 text-xs font-medium leading-relaxed",
        styles[variant].box,
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      <span className="mt-0.5 shrink-0">{styles[variant].icon}</span>
      <span>{children}</span>
    </div>
  );
}
