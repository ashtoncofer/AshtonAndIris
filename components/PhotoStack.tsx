"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { StoryPhoto } from "@/lib/story";

interface PhotoStackProps {
  photos: StoryPhoto[];
  accentColor: string;
}

export default function PhotoStack({ photos, accentColor }: PhotoStackProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const realPhotos = photos.filter((p) => !p.placeholder && p.src);
  const placeholders = photos.filter((p) => p.placeholder);
  const displayPhotos = realPhotos.length > 0 ? realPhotos : placeholders;

  if (displayPhotos.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main image */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {displayPhotos[activeIdx].placeholder ? (
              <div
                className="w-full h-full flex items-center justify-center text-white/40 text-sm"
                style={{ background: `${accentColor}22` }}
              >
                📷 Photo coming soon
              </div>
            ) : (
              <Image
                src={displayPhotos[activeIdx].src}
                alt={displayPhotos[activeIdx].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {displayPhotos.length > 1 && (
        <div className="flex gap-2 justify-center">
          {displayPhotos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                idx === activeIdx ? "scale-105 opacity-100" : "opacity-50 hover:opacity-75"
              }`}
              style={{ borderColor: idx === activeIdx ? accentColor : "transparent" }}
            >
              {photo.placeholder ? (
                <div
                  className="w-full h-full flex items-center justify-center text-xs"
                  style={{ background: `${accentColor}33` }}
                >
                  📷
                </div>
              ) : (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
