"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StoryPhoto } from "@/lib/story";

interface ChapterPhotoProps {
  chapterId: string;
  photos: StoryPhoto[];
  accentColor: string;
  isLast?: boolean;
}

export default function ChapterPhoto({
  chapterId,
  photos,
  accentColor,
  isLast = false,
}: ChapterPhotoProps) {
  const [idx, setIdx] = useState(0);

  // Reset to first photo when chapter changes
  useEffect(() => {
    setIdx(0);
  }, [chapterId]);

  const real = photos.filter((p) => !p.placeholder && p.src);
  const display = real.length > 0 ? real : photos.filter((p) => p.placeholder);
  const hasManyPhotos = display.length > 1;

  // Special Montreal announcement
  if (isLast) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-[#020210] overflow-hidden">
        {/* Animated starfield rings */}
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-red-500/20"
            style={{ width: i * 200, height: i * 200 }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-6 text-center px-8"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl"
          >
            ✈️
          </motion.div>
          <div className="flex flex-col gap-2">
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase">Next Adventure</p>
            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">Montréal</h2>
            <p className="text-white/50 text-lg mt-1">Québec, Canada</p>
          </div>
          <motion.div
            className="px-6 py-2 rounded-full text-sm font-semibold"
            style={{ background: `${accentColor}30`, border: `1px solid ${accentColor}60`, color: accentColor }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Coming Soon
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (display.length === 0) return null;
  const current = display[idx];

  return (
    <div className="relative w-full h-full overflow-hidden group">
      {/* Photo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${chapterId}-${idx}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {current.placeholder ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `${accentColor}12` }}
            >
              <div className="flex flex-col items-center gap-3 text-white/30">
                <span className="text-5xl">📷</span>
                <span className="text-sm tracking-wide">Photo placeholder</span>
              </div>
            </div>
          ) : (
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(2,2,16,0.5) 100%)" }}
      />

      {/* Left edge gradient → blends into the globe/text panel */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#020210] to-transparent pointer-events-none" />

      {/* Photo counter + dots */}
      {hasManyPhotos && (
        <>
          {/* Dots — top centre */}
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 z-20">
            {display.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Photo ${i + 1}`}
                className="rounded-full transition-all"
                style={{
                  width: i === idx ? 20 : 6,
                  height: 6,
                  background: i === idx ? "white" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>

          {/* Prev / next arrows — visible on hover */}
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:bg-black/60 disabled:opacity-0 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setIdx((i) => Math.min(display.length - 1, i + 1))}
            disabled={idx === display.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:bg-black/60 disabled:opacity-0 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>

          {/* Counter badge */}
          <div className="absolute top-4 right-4 z-20 text-xs text-white/60 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {idx + 1} / {display.length}
          </div>
        </>
      )}
    </div>
  );
}
