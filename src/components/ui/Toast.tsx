import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const typeStyles: Record<ToastType, { bg: string; icon: typeof CheckCircle; color: string }> = {
  success: { bg: "bg-[#1e7b65]", icon: CheckCircle, color: "text-white" },
  error: { bg: "bg-[#b22323]", icon: AlertCircle, color: "text-white" },
  info: { bg: "bg-[#ff6b9d]", icon: Info, color: "text-white" },
};

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const { bg, icon: Icon, color } = typeStyles[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={[
        "flex items-center gap-2 px-4 py-3 rounded-full shadow-lg",
        bg,
        color,
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
      ].join(" ")}
    >
      <Icon size={16} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

// グローバルトースト管理
let toastCallback: ((msg: string, type?: ToastType) => void) | null = null;

export function registerToast(cb: (msg: string, type?: ToastType) => void) {
  toastCallback = cb;
}

export function showToast(msg: string, type?: ToastType) {
  toastCallback?.(msg, type);
}

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let counter = 0;

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    registerToast((msg, type = "success") => {
      const id = ++counter;
      setToasts((prev) => [...prev, { id, message: msg, type }]);
    });
  }, []);

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
      ))}
    </div>
  );
}
