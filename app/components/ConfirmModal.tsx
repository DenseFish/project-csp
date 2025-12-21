"use client";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-[#0f172a] rounded-lg p-6 w-full max-w-md animate-scale-in">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-300 mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          {/* ❌ CANCEL HANYA MUNCUL JIKA ADA TEXT */}
          {cancelText && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
