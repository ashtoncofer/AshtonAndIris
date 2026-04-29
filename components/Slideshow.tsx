"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
  lazy,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Globe2 } from "lucide-react";
import { chapters, StoryPhoto } from "@/lib/story";

const Globe = lazy(() => import("./Globe"));

const FLY_MS = 1300;

// ─── Floating card position templates ────────────────────────────────────────
// Each entry: { top, right } as viewport %, rot in deg, w in px
const CARD_LAYOUTS: { top: number; right: number; rot: number; w: number }[][] = [
  // 1 photo
  [{ top: 18, right: 6, rot: -1.5, w: 310 }],
  // 2 photos
  [
    { top: 12, right: 14, rot: -2, w: 280 },
    { top: 52, right: 4,  rot: 2,  w: 280 },
  ],
  // 3 photos
  [
    { top: 6,  right: 18, rot: -2,   w: 250 },
    { top: 38, right: 4,  rot: 1.5,  w: 250 },
    { top: 65, right: 20, rot: -1,   w: 250 },
  ],
  // 4 photos
  [
    { top: 5,  right: 22, rot: -2,   w: 225 },
    { top: 5,  right: 3,  rot: 1.5,  w: 225 },
    { top: 52, right: 16, rot: 2,    w: 225 },
    { top: 52, right: 1,  rot: -1.5, w: 225 },
  ],
];

function getLayout(count: number) {
  return CARD_LAYOUTS[Math.min(count, 4) - 1] ?? CARD_LAYOUTS[0];
}

// ─── Single floating photo card ───────────────────────────────────────────────
function PhotoCard({
  photo,
  pos,
  delay,
}: {
  photo: StoryPhoto;
  pos: { top: number; right: number; rot: number; w: number };
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute",
        top: `${pos.top}%`,
        right: `${pos.right}%`,
        width: pos.w,
        transform: `rotate(${pos.rot}deg)`,
        zIndex: 20,
      }}
      className="rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
    >
      {photo.placeholder ? (
        <div
          className="flex items-center justify-center bg-white/5"
          style={{ width: pos.w, height: Math.round(pos.w * 0.72) }}
        >
          <div className="text-center text-white/30">
            <div className="text-3xl mb-1">📷</div>
            <div className="text-xs">Photo coming soon</div>
          </div>
        </div>
      ) : (
        <div style={{ width: pos.w, height: Math.round(pos.w * 0.72), position: "relative" }}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover"
            sizes={`${pos.w}px`}
          />
        </div>
      )}
    </motion.div>
  );
}

// ─── Montreal announcement ────────────────────────────────────────────────────
function MontrealCard({ accentColor }: { accentColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.2, duration: 0.7 }}
      style={{ position: "absolute", top: "20%", right: "5%", zIndex: 20 }}
      className="flex flex-col items-center gap-5 text-center"
    >
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-red-500/20"
          style={{
            width: i * 140,
            height: i * 140,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl relative z-10"
      >
        ✈️
      </motion.div>
      <div className="relative z-10 flex flex-col gap-1">
        <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase">Next Adventure</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">Montréal</h2>
        <p className="text-white/50 text-sm">Québec, Canada</p>
      </div>
      <motion.div
        className="relative z-10 px-5 py-1.5 rounded-full text-xs font-semibold"
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
  );
}

// ─── Main slideshow ───────────────────────────────────────────────────────────
export default function Slideshow() {
  const [displayIdx, setDisplayIdx] = useState(0);
  const [pendingIdx, setPendingIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateTo = useCallback(
    (idx: number) => {
      if (transitioning || idx === displayIdx || idx < 0 || idx >= chapters.length) return;
      setPendingIdx(idx);
      setTransitioning(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setDisplayIdx(idx);
        setTransitioning(false);
      }, FLY_MS);
    },
    [transitioning, displayIdx]
  );

  const prev = useCallback(() => navigateTo(displayIdx - 1), [navigateTo, displayIdx]);
  const next = useCallback(() => navigateTo(displayIdx + 1), [navigateTo, displayIdx]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  const chapter = chapters[displayIdx];
  const pending = chapters[pendingIdx];
  const isFirst = displayIdx === 0;
  const isLast  = displayIdx === chapters.length - 1;

  // Globe markers
  const markers = chapters.map((c, i) => ({
    lat: c.lat, lng: c.lng,
    label: c.location.split(",")[0],
    color: c.accentColor,
    isActive:  i === pendingIdx,
    isVisited: i < pendingIdx,
    chapterIdx: i,
  }));

  // Travel arc
  const arc = pending.travelFrom
    ? {
        startLat: pending.travelFrom.lat,
        startLng: pending.travelFrom.lng,
        endLat: pending.lat,
        endLng: pending.lng,
        color: pending.accentColor,
      }
    : null;

  // A / I person pins
  const ashtonPos = chapter.ashton ?? { lat: chapter.lat, lng: chapter.lng };
  const irisPos   = chapter.iris   ?? { lat: chapter.lat, lng: chapter.lng };

  // Offset slightly when co-located so pins don't overlap
  const together = !chapter.ashton && !chapter.iris;
  const personPins = [
    {
      lat: together ? ashtonPos.lat + 0.18 : ashtonPos.lat,
      lng: together ? ashtonPos.lng - 0.22 : ashtonPos.lng,
      label: "A" as const,
      color: "#60a5fa",
      name: "Ashton",
    },
    {
      lat: together ? irisPos.lat - 0.18 : irisPos.lat,
      lng: together ? irisPos.lng + 0.22 : irisPos.lng,
      label: "I" as const,
      color: "#f9a8d4",
      name: "Iris",
    },
  ];

  // Photos (skip placeholders when real photos exist)
  const real = chapter.photos.filter((p) => !p.placeholder && p.src);
  const displayPhotos = real.length > 0 ? real.slice(0, 4) : chapter.photos.slice(0, 1);
  const layout = getLayout(displayPhotos.length);

  return (
    <motion.div
      className="relative w-full h-screen overflow-hidden bg-[#020210] text-white"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.08}
      onDragEnd={(_, info) => {
        if (info.offset.x < -60) next();
        if (info.offset.x >  60) prev();
      }}
    >
      {/* ── Globe: full-screen background ─── */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="w-full h-full bg-[#020210]" />}>
          <Globe
            targetLat={pending.lat}
            targetLng={pending.lng}
            altitude={pending.altitude}
            markers={markers}
            arc={arc}
            activeColor={chapter.accentColor}
            personPins={personPins}
            onMarkerClick={navigateTo}
          />
        </Suspense>
      </div>

      {/* ── Gradient overlay: dark on left, fully transparent on right ─── */}
      {/* One smooth gradient — no panel edge line */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(2,2,16,0.97) 0%, rgba(2,2,16,0.90) 30%, rgba(2,2,16,0.55) 50%, rgba(2,2,16,0.15) 65%, transparent 78%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(2,2,16,0.7), transparent)" }}
      />

      {/* ── Text panel: positioned on top of gradient, no background of its own ─── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-10 md:px-14 lg:px-18 pointer-events-none">
        {/* Header */}
        <div className="absolute top-6 left-10 md:left-14 flex items-center gap-2 text-white/30 text-xs tracking-widest uppercase">
          <Globe2 size={12} />
          <span>Ashton & Iris</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-3 lg:gap-5 max-w-[420px] pointer-events-auto"
          >
            {/* Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[11px] font-semibold tracking-[0.18em] uppercase px-3 py-1 rounded-full"
                style={{
                  background: `${chapter.accentColor}22`,
                  color: chapter.accentColor,
                  border: `1px solid ${chapter.accentColor}45`,
                }}
              >
                Chapter {chapter.chapter} / {chapters.length}
              </span>
              {isLast && (
                <span className="text-[11px] font-semibold tracking-[0.18em] uppercase px-3 py-1 rounded-full bg-white/10 border border-white/20">
                  ✈️ Announcement
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              {chapter.title}
            </h1>

            {/* Date + location */}
            <div className="flex flex-col gap-1.5">
              <span className="text-white/45 text-sm">{chapter.date}</span>
              <span className="flex items-center gap-1.5 text-white/45 text-sm">
                <MapPin size={12} />
                {chapter.location}
              </span>
            </div>

            {/* Description */}
            <p className="hidden sm:block text-white/70 text-sm md:text-base leading-relaxed max-w-[360px]">
              {chapter.description}
            </p>

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={prev}
                disabled={isFirst || transitioning}
                className="p-2 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5 disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-[5px] overflow-hidden max-w-[200px] lg:max-w-xs">
                {chapters.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => navigateTo(i)}
                    className="flex-shrink-0 rounded-full transition-all duration-300"
                    style={{
                      width:  i === displayIdx ? 18 : 5,
                      height: 5,
                      background:
                        i === displayIdx
                          ? chapter.accentColor
                          : i < displayIdx
                          ? "rgba(255,255,255,0.38)"
                          : "rgba(255,255,255,0.14)",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                disabled={isLast || transitioning}
                className="p-2 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5 disabled:opacity-20 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Floating photo cards ─── */}
      <AnimatePresence mode="wait">
        {!transitioning && (
          <motion.div key={chapter.id + "-photos"} className="absolute inset-0 z-20 pointer-events-none">
            {isLast ? (
              <MontrealCard accentColor={chapter.accentColor} />
            ) : (
              displayPhotos.map((photo, i) => (
                <PhotoCard
                  key={i}
                  photo={photo}
                  pos={layout[i]}
                  delay={i * 0.08}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Progress bar ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-30">
        <motion.div
          className="h-full"
          style={{ background: chapter.accentColor }}
          animate={{ width: `${((displayIdx + 1) / chapters.length) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* ── Hint ─── */}
      <div className="absolute bottom-4 right-5 text-white/20 text-xs z-30 hidden md:block select-none">
        ← → or click a marker
      </div>
    </motion.div>
  );
}
