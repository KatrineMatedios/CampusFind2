import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export default function Input({
  label,
  error,
  hint,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="block text-xs font-semibold text-stone-700">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400",
            icon && "pl-10",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-stone-200 focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/15",
            className,
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
      </div>
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-stone-500">{hint}</p> : null}
    </div>
  );
}
