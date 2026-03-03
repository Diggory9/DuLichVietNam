"use client";

import { motion } from "motion/react";

export default function NotFoundClient() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 select-none"
    >
      404
    </motion.h1>
  );
}
