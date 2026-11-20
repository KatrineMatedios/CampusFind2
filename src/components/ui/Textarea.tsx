import { useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={textareaId} className="block text-xs font-semibold text-stone-700">
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        className={cn(
          "w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400",
          error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-stone-200 focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/15",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-stone-500">{hint}</p> : null}
    </div>
  );
}
