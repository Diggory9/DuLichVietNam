"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "@/components/ui/ToastProvider";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const openPopup = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400,scrollbars=yes");
    setOpen(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    toast("Đã sao chép liên kết!", { variant: "success" });
    setOpen(false);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text: description || title, url });
    } catch {
      // User cancelled or not supported
    }
    setOpen(false);
  };

  const shareOptions = [
    {
      label: "Facebook",
      onClick: () => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`),
      color: "text-blue-600 dark:text-blue-400",
      bg: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: "Zalo",
      onClick: () => openPopup(`https://zalo.me/share?url=${encodedUrl}`),
      color: "text-blue-500 dark:text-blue-400",
      bg: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 48 48">
          <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm7.747 30.773H16.84c-1.253 0-2.267-.498-2.267-1.78 0-.775.37-1.47 1.13-2.385l8.1-9.96h-7.35c-.68 0-1.23-.55-1.23-1.23s.55-1.23 1.23-1.23h12.6c1.253 0 2.267.498 2.267 1.78 0 .775-.37 1.47-1.13 2.385l-8.1 9.96h7.657c.68 0 1.23.55 1.23 1.23s-.55 1.23-1.23 1.23z" />
        </svg>
      ),
    },
    {
      label: "X (Twitter)",
      onClick: () => openPopup(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`),
      color: "text-gray-800 dark:text-gray-200",
      bg: "hover:bg-gray-100 dark:hover:bg-gray-700",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      onClick: () => openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`),
      color: "text-sky-700 dark:text-sky-400",
      bg: "hover:bg-sky-50 dark:hover:bg-sky-900/30",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "Sao chép liên kết",
      onClick: handleCopy,
      color: "text-gray-500 dark:text-gray-400",
      bg: "hover:bg-gray-100 dark:hover:bg-gray-700",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => {
          if (typeof navigator !== "undefined" && "share" in navigator) {
            handleNativeShare();
          } else {
            setOpen((v) => !v);
          }
        }}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Chia sẻ"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Chia sẻ
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
          >
            {shareOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={opt.onClick}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${opt.color} ${opt.bg} transition-colors`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
