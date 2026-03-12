"use client";

import { useState, useEffect } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{ transform: `scaleX(${progress})`, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 z-[60] will-change-transform"
    />
  );
}
