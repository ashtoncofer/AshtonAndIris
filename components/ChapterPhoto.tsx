"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  const real = photos.filter((p) => !p.placeholder && p.src);
  const display = real.length > 0 ? real : photos.filter((p) => p.placeholder);
  const count = display.length;

  // Special Montreal announcement
  if (isLast) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-[#020210] overflow-hidden">
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
          initial={{ opacity: 0, scale: 0.85 }}
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
            style={{
              background: `${accentColor}30`,
              border: `1px solid ${accentColor}60`,
              color: accentColor,
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Coming Soon
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (count === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={chapterId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <PhotoGrid photos={display} accentColor={accentColor} />

        {/* Left edge gradient → blends into globe/text panel */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#020210] to-transparent pointer-events-none z-10" />

        {/* Bottom accent glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
          style={{ background: `linear-gradient(to top, ${accentColor}18, transparent)` }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Grid layouts based on photo count ────────────────────────────────────────

function PhotoGrid({ photos, accentColor }: { photos: StoryPhoto[]; accentColor: string }) {
  const count = photos.length;

  if (count === 1) {
    return <PhotoCell photo={photos[0]} accentColor={accentColor} className="absolute inset-0" />;
  }

  if (count === 2) {
    return (
      <div className="absolute inset-0 grid grid-cols-2 gap-1">
        <PhotoCell photo={photos[0]} accentColor={accentColor} />
        <PhotoCell photo={photos[1]} accentColor={accentColor} />
      </div>
    );
  }

  if (count === 3) {
    // Large on left, two stacked on right
    return (
      <div className="absolute inset-0 grid grid-cols-2 gap-1">
        <PhotoCell photo={photos[0]} accentColor={accentColor} className="row-span-2" />
        <PhotoCell photo={photos[1]} accentColor={accentColor} />
        <PhotoCell photo={photos[2]} accentColor={accentColor} />
      </div>
    );
  }

  // 4+ photos: 2×2 grid (show first 4)
  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1">
      {photos.slice(0, 4).map((photo, i) => (
        <PhotoCell key={i} photo={photo} accentColor={accentColor} />
      ))}
    </div>
  );
}

function PhotoCell({
  photo,
  accentColor,
  className = "",
}: {
  photo: StoryPhoto;
  accentColor: string;
  className?: string;
}) {
  if (photo.placeholder) {
    return (
      <div
        className={`relative overflow-hidden flex items-center justify-center ${className}`}
        style={{ background: `${accentColor}10` }}
      >
        <div className="flex flex-col items-center gap-2 text-white/25">
          <span className="text-3xl">📷</span>
          <span className="text-xs">Photo coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 50vw, 26vw"
      />
    </div>
  );
}
