import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  hideClose?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  hideClose = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: "max-w-xs", md: "max-w-sm", lg: "max-w-md" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative z-10 w-full rounded-2xl bg-white p-5 shadow-2xl",
          sizes[size],
        )}
      >
        {(title || !hideClose) && (
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              {title ? (
                <h2 className="text-base font-bold text-stone-800">{title}</h2>
              ) : null}
              {subtitle ? (
                <p className="mt-1 text-xs text-stone-500">{subtitle}</p>
              ) : null}
            </div>
            {!hideClose ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            ) : null}
          </div>
        )}
        {children}
        {footer ? <div className="mt-5">{footer}</div> : null}
      </div>
    </div>
  );
}
