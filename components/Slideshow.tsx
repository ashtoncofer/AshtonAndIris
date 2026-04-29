"use client";

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { chapters, allLocations } from "@/lib/story";
import PhotoStack from "./PhotoStack";

const Globe = lazy(() => import("./Globe"));

export default function Slideshow() {
  const [current, setCurrent] = useState(0);
  const chapter = chapters[current];

  const prev = useCallback(() => setCurrent((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setCurrent((i) => Math.min(chapters.length - 1, i + 1)),
    []
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const arc =
    chapter.travelFrom
      ? {
          startLat: chapter.travelFrom.lat,
          startLng: chapter.travelFrom.lng,
          endLat: chapter.lat,
          endLng: chapter.lng,
          color: chapter.accentColor,
        }
      : null;

  const isLast = current === chapters.length - 1;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a1a] text-white select-none">
      {/* Globe background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full opacity-90">
          <Suspense fallback={<div className="w-full h-full bg-[#0a0a1a]" />}>
            <Globe
              targetLat={chapter.lat}
              targetLng={chapter.lng}
              points={allLocations}
              arc={arc}
              activeColor={chapter.accentColor}
            />
          </Suspense>
        </div>
      </div>

      {/* Gradient overlay — left side for text */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/60 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row">
        {/* Left panel — text */}
        <div className="flex flex-col justify-center lg:w-[48%] px-8 md:px-14 lg:px-16 pt-20 pb-24 lg:py-24 gap-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col gap-4"
            >
              {/* Chapter badge */}
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{
                    background: `${chapter.accentColor}30`,
                    color: chapter.accentColor,
                    border: `1px solid ${chapter.accentColor}50`,
                  }}
                >
                  Chapter {chapter.chapter}
                </span>
                {isLast && (
                  <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
                    ✈️ Announcement
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                {chapter.title}
              </h1>

              {/* Date + Location */}
              <div className="flex flex-col gap-1 text-white/60">
                <span className="text-sm font-medium">{chapter.date}</span>
                <span className="flex items-center gap-1 text-sm">
                  <MapPin size={13} className="opacity-70" />
                  {chapter.location}
                </span>
              </div>

              {/* Description */}
              <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-md">
                {chapter.description}
              </p>

              {/* Photo stack (mobile/tablet only — below text) */}
              <div className="block lg:hidden mt-2">
                <PhotoStack photos={chapter.photos} accentColor={chapter.accentColor} />
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={prev}
                  disabled={current === 0}
                  className="p-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/50 disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-1.5">
                  {chapters.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className="rounded-full transition-all"
                      style={{
                        width: i === current ? 20 : 6,
                        height: 6,
                        background:
                          i === current ? chapter.accentColor : "rgba(255,255,255,0.25)",
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  disabled={current === chapters.length - 1}
                  className="p-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/50 disabled:opacity-20 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right panel — photos (desktop only) */}
        <div className="hidden lg:flex flex-col justify-center lg:w-[52%] px-12 py-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id + "-photos"}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-md ml-auto"
            >
              <PhotoStack photos={chapter.photos} accentColor={chapter.accentColor} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Montreal announcement glow */}
      {isLast && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(231,76,60,0.08) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full"
          style={{ background: chapter.accentColor }}
          animate={{ width: `${((current + 1) / chapters.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-4 right-6 text-white/30 text-xs hidden md:block">
        ← → to navigate
      </div>
    </div>
  );
}
