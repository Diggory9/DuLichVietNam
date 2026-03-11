"use client";

import { useState } from "react";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function CancelBookingModal({
  isOpen,
  onClose,
  onConfirm,
}: CancelBookingModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  function handleConfirm() {
    onConfirm(reason);
    setReason("");
  }

  function handleClose() {
    setReason("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6 z-10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          X\u00e1c nh\u1eadn hu\u1ef7 \u0111\u1eb7t ch\u1ed7
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          B\u1ea1n c\u00f3 ch\u1eafc ch\u1eafn mu\u1ed1n hu\u1ef7 \u0111\u1eb7t ch\u1ed7 n\u00e0y? H\u00e0nh \u0111\u1ed9ng n\u00e0y kh\u00f4ng th\u1ec3 ho\u00e0n t\u00e1c.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            L\u00fd do hu\u1ef7 (tu\u1ef3 ch\u1ecdn)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Nh\u1eadp l\u00fd do hu\u1ef7..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            \u0110\u00f3ng
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            X\u00e1c nh\u1eadn hu\u1ef7
          </button>
        </div>
      </div>
    </div>
  );
}
