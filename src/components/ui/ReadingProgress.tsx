"use client";

import { useScroll, motion } from "motion/react";

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 z-[60]"
    />
  );
}
