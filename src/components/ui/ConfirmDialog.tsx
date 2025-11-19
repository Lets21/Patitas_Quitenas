// src/components/ui/ConfirmDialog.tsx
import { Button } from "./Button";
import { Card } from "./Card";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "warning",
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const variantStyles = {
    danger: "text-red-600 bg-red-50",
    warning: "text-orange-600 bg-orange-50",
    info: "text-blue-600 bg-blue-50",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${variantStyles[variant]}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                {cancelText}
              </Button>
              <Button onClick={handleConfirm} disabled={isLoading}>
                {isLoading ? "Procesando..." : confirmText}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
