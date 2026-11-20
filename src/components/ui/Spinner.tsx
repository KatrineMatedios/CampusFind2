import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Spinner({ label, className, size = "md" }: SpinnerProps) {
  const sizes = { sm: 16, md: 24, lg: 36 };

  return (
    <div className={cn("flex items-center justify-center gap-2 text-brand-brown", className)}>
      <Loader2 size={sizes[size]} className="animate-spin" />
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </div>
  );
}
