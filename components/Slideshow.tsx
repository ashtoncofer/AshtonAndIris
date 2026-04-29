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
import Timeline from "./Timeline";

const Globe = lazy(() => import("./Globe"));

const FLY_MS = 1300;

// ─── Parse "July 26, 2021" → { month: "July", year: "2021" } ────────────────
function parseDate(dateStr: string): { month: string; year: string } {
  const full = dateStr.match(/^([A-Za-zÀ-ÿ]+(?:[–\-\s]+[A-Za-z]+)?)\s+(?:\d+,\s+)?(\d{4})$/);
  if (full) return { month: full[1], year: full[2] };
  const justYear = dateStr.match(/(\d{4})/);
  const prefix = dateStr.replace(/\d{4}/, "").replace(/[,\s]+$/, "").trim();
  return { month: prefix || dateStr, year: justYear?.[1] ?? "" };
}

// ─── Floating card positions ──────────────────────────────────────────────────
const CARD_LAYOUTS: { top: number; right: number; rot: number; w: number }[][] = [
  [{ top: 16, right: 5, rot: -1.5, w: 310 }],
  [
    { top: 10, right: 12, rot: -2,  w: 280 },
    { top: 52, right: 3,  rot: 2,   w: 280 },
  ],
  [
    { top: 5,  right: 16, rot: -2,  w: 250 },
    { top: 38, right: 3,  rot: 1.5, w: 250 },
    { top: 64, right: 18, rot: -1,  w: 250 },
  ],
  [
    { top: 4,  right: 20, rot: -2,  w: 222 },
    { top: 4,  right: 2,  rot: 1.5, w: 222 },
    { top: 51, right: 14, rot: 2,   w: 222 },
    { top: 51, right: 0,  rot: -1.5,w: 222 },
  ],
];
function getLayout(count: number) {
  return CARD_LAYOUTS[Math.min(count, 4) - 1] ?? CARD_LAYOUTS[0];
}

// ─── Photo card ───────────────────────────────────────────────────────────────
function PhotoCard({
  photo,
  pos,
  delay,
}: {
  photo: StoryPhoto;
  pos: { top: number; right: number; rot: number; w: number };
  delay: number;
}) {
  const h = Math.round(pos.w * 0.72);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "absolute",
        top: `${pos.top}%`,
        right: `${pos.right}%`,
        width: pos.w,
        rotate: pos.rot,
        zIndex: 20,
      }}
      className="rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.65)] ring-1 ring-white/10"
    >
      {photo.placeholder ? (
        <div
          className="flex items-center justify-center bg-white/5"
          style={{ width: pos.w, height: h }}
        >
          <div className="text-center text-white/30">
            <div className="text-3xl mb-1">📷</div>
            <div className="text-xs">Photo coming soon</div>
          </div>
        </div>
      ) : (
        <div style={{ width: pos.w, height: h, position: "relative" }}>
          <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes={`${pos.w}px`} />
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
      style={{ position: "absolute", top: "18%", right: "6%", zIndex: 20 }}
      className="flex flex-col items-center gap-5 text-center"
    >
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-red-500/20"
          style={{
            width: i * 140, height: i * 140,
            top: "50%", left: "50%",
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
        style={{ background: `${accentColor}30`, border: `1px solid ${accentColor}60`, color: accentColor }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Coming Soon
      </motion.div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
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

  const { month, year } = parseDate(chapter.date);

  const markers = chapters.map((c, i) => ({
    lat: c.lat, lng: c.lng,
    label: c.location.split(",")[0],
    color: c.accentColor,
    isActive:  i === pendingIdx,
    isVisited: i < pendingIdx,
    chapterIdx: i,
  }));

  const arc = pending.travelFrom
    ? { startLat: pending.travelFrom.lat, startLng: pending.travelFrom.lng, endLat: pending.lat, endLng: pending.lng, color: pending.accentColor }
    : null;

  const ashtonPos = chapter.ashton ?? { lat: chapter.lat, lng: chapter.lng };
  const irisPos   = chapter.iris   ?? { lat: chapter.lat, lng: chapter.lng };
  const together  = !chapter.ashton && !chapter.iris;
  const personPins = [
    { lat: together ? ashtonPos.lat + 0.18 : ashtonPos.lat, lng: together ? ashtonPos.lng - 0.22 : ashtonPos.lng, label: "A" as const, color: "#60a5fa", name: "Ashton" },
    { lat: together ? irisPos.lat - 0.18 : irisPos.lat,     lng: together ? irisPos.lng + 0.22 : irisPos.lng,     label: "I" as const, color: "#f9a8d4", name: "Iris"   },
  ];

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
      {/* Globe */}
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

      {/* Gradient overlay — no panel edge */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(2,2,16,0.97) 0%, rgba(2,2,16,0.90) 28%, rgba(2,2,16,0.52) 50%, rgba(2,2,16,0.12) 66%, transparent 80%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(2,2,16,0.98) 0%, transparent 100%)" }}
      />

      {/* ── Left text content ─── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-10 md:px-14 pointer-events-none">
        {/* Site label */}
        <div className="absolute top-6 left-10 md:left-14 flex items-center gap-2 text-white/25 text-xs tracking-widest uppercase">
          <Globe2 size={12} />
          <span>Ashton & Iris</span>
        </div>

        {/* Prev / next */}
        <div className="absolute top-6 right-6 flex items-center gap-2 pointer-events-auto">
          <button
            onClick={prev}
            disabled={isFirst || transitioning}
            className="p-2 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/5 disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            disabled={isLast || transitioning}
            className="p-2 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/5 disabled:opacity-20 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-3 lg:gap-4 max-w-[440px] pointer-events-auto"
          >
            {/* Era label */}
            <span
              className="text-[11px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: chapter.accentColor }}
            >
              {chapter.era}
            </span>

            {/* Big date */}
            <div className="flex flex-col leading-none -mb-1">
              <span className="text-sm md:text-base tracking-[0.2em] uppercase text-white/40 font-medium">
                {month}
              </span>
              {year && (
                <span className="text-7xl md:text-8xl lg:text-9xl font-bold text-white/90 tracking-tight leading-none">
                  {year}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
              {chapter.title}
            </h1>

            {/* Location */}
            <span className="flex items-center gap-1.5 text-white/40 text-xs">
              <MapPin size={11} />
              {chapter.location}
            </span>

            {/* Description */}
            <p className="hidden sm:block text-white/65 text-sm leading-relaxed max-w-[340px]">
              {chapter.description}
            </p>
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
                <PhotoCard key={i} photo={photo} pos={layout[i]} delay={i * 0.08} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Timeline ─── */}
      <Timeline currentIdx={displayIdx} onNavigate={navigateTo} />
    </motion.div>
  );
}
