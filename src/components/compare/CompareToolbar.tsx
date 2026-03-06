"use client";

import { useRouter } from "next/navigation";
import { useCompare } from "./CompareProvider";
import { motion, AnimatePresence } from "motion/react";

export default function CompareToolbar() {
  const { compareSlugs, removeFromCompare, clearCompare } = useCompare();
  const router = useRouter();

  const visible = compareSlugs.length >= 2;

  const handleCompare = () => {
    router.push(`/so-sanh?slugs=${compareSlugs.join(",")}`);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 px-5 py-3 flex items-center gap-3"
        >
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
            So sánh ({compareSlugs.length}/3):
          </span>
          <div className="flex items-center gap-2">
            {compareSlugs.map((slug) => (
              <span
                key={slug}
                className="inline-flex items-center gap-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2.5 py-1 rounded-full text-xs font-medium"
              >
                {slug}
                <button
                  onClick={() => removeFromCompare(slug)}
                  className="ml-0.5 hover:text-red-500 transition-colors"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={handleCompare}
            className="ml-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
          >
            So sánh ngay
          </button>
          <button
            onClick={clearCompare}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm transition-colors"
            title="Xoá tất cả"
          >
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
