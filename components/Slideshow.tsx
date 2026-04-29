"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
  lazy,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Globe2 } from "lucide-react";
import { chapters } from "@/lib/story";
import ChapterPhoto from "./ChapterPhoto";

const Globe = lazy(() => import("./Globe"));

// How long the globe flies before content swaps in
const FLY_DURATION_MS = 1300;

export default function Slideshow() {
  // displayIdx drives the content (text + photo)
  // pendingIdx drives the globe target — updates immediately on navigate
  const [displayIdx, setDisplayIdx] = useState(0);
  const [pendingIdx, setPendingIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateTo = useCallback(
    (idx: number) => {
      if (transitioning || idx === displayIdx || idx < 0 || idx >= chapters.length) return;
      setPendingIdx(idx);      // globe starts flying NOW
      setTransitioning(true);  // photo + text fade out NOW
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setDisplayIdx(idx);
        setTransitioning(false);
      }, FLY_DURATION_MS);
    },
    [transitioning, displayIdx]
  );

  const prev = useCallback(() => navigateTo(displayIdx - 1), [navigateTo, displayIdx]);
  const next = useCallback(() => navigateTo(displayIdx + 1), [navigateTo, displayIdx]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const chapter = chapters[displayIdx];
  const pendingChapter = chapters[pendingIdx];
  const isFirst = displayIdx === 0;
  const isLast = displayIdx === chapters.length - 1;

  const markers = chapters.map((c, i) => ({
    lat: c.lat,
    lng: c.lng,
    label: c.location.split(",")[0],
    color: c.accentColor,
    isActive: i === pendingIdx,
    isVisited: i < pendingIdx,
    chapterIdx: i,
  }));

  const arc = pendingChapter.travelFrom
    ? {
        startLat: pendingChapter.travelFrom.lat,
        startLng: pendingChapter.travelFrom.lng,
        endLat: pendingChapter.lat,
        endLng: pendingChapter.lng,
        color: pendingChapter.accentColor,
      }
    : null;

  return (
    <motion.div
      className="relative w-full h-screen overflow-hidden bg-[#020210] text-white"
      // Swipe support on mobile
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.x < -60) next();
        if (info.offset.x > 60) prev();
      }}
    >
      {/* ── GLOBE: full-screen background ─────────────────────────── */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="w-full h-full bg-[#020210]" />}>
          <Globe
            targetLat={pendingChapter.lat}
            targetLng={pendingChapter.lng}
            markers={markers}
            arc={arc}
            activeColor={chapter.accentColor}
            onMarkerClick={navigateTo}
          />
        </Suspense>
      </div>

      {/* ── LAYOUT ────────────────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row pointer-events-none">

        {/* ── LEFT: Text panel ───────────────────────────────────── */}
        <div
          className="
            lg:w-[48%] w-full
            flex flex-col justify-end lg:justify-center
            px-8 md:px-12 lg:px-16
            pb-8 lg:py-20
            h-[45%] lg:h-full
            pointer-events-auto
          "
          style={{
            background:
              "linear-gradient(to right, rgba(2,2,16,0.97) 0%, rgba(2,2,16,0.88) 55%, transparent 100%)",
          }}
        >
          {/* Top header (desktop only) */}
          <div className="absolute top-7 left-8 lg:left-16 flex items-center gap-2 text-white/30 text-xs tracking-widest uppercase">
            <Globe2 size={13} />
            <span>Ashton & Iris</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col gap-3 lg:gap-5"
            >
              {/* Chapter badge */}
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
              <p className="hidden sm:block text-white/70 text-sm md:text-base leading-relaxed max-w-sm lg:max-w-[380px]">
                {chapter.description}
              </p>

              {/* Navigation */}
              <div className="flex items-center gap-3 mt-1 lg:mt-3">
                <button
                  onClick={prev}
                  disabled={isFirst || transitioning}
                  className="p-2 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5 disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Dot trail */}
                <div className="flex items-center gap-[5px] overflow-hidden max-w-[220px] lg:max-w-xs">
                  {chapters.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => navigateTo(i)}
                      aria-label={`Go to chapter ${i + 1}`}
                      className="flex-shrink-0 rounded-full transition-all duration-300"
                      style={{
                        width: i === displayIdx ? 20 : 5,
                        height: 5,
                        background:
                          i === displayIdx
                            ? chapter.accentColor
                            : i < displayIdx
                            ? "rgba(255,255,255,0.40)"
                            : "rgba(255,255,255,0.15)",
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

        {/* ── RIGHT: Full-height photo panel ─────────────────────── */}
        <div className="lg:w-[52%] w-full h-[55%] lg:h-full relative pointer-events-auto">
          {/* Crossfade container — opacity driven by transitioning */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: transitioning ? 0 : 1 }}
            transition={{ duration: 0.45 }}
          >
            <ChapterPhoto
              key={chapter.id}
              chapterId={chapter.id}
              photos={chapter.photos}
              accentColor={chapter.accentColor}
              isLast={isLast}
            />
          </motion.div>

          {/* Accent color glow at bottom of photo */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            animate={{ opacity: transitioning ? 0 : 0.6 }}
            style={{
              background: `linear-gradient(to top, ${chapter.accentColor}25, transparent)`,
            }}
          />
        </div>
      </div>

      {/* ── TRANSITION FLASH ───────────────────────────────────────── */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: "black" }}
          />
        )}
      </AnimatePresence>

      {/* ── LOCATION FLASH on chapter change ───────────────────────── */}
      <AnimatePresence>
        {!transitioning && (
          <motion.div
            key={chapter.id + "-loc"}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="absolute top-6 right-6 z-20 hidden lg:flex items-center gap-1.5 text-white/35 text-xs tracking-wide"
          >
            <MapPin size={11} />
            {chapter.location}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PROGRESS BAR ──────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
        <motion.div
          className="h-full"
          style={{ background: chapter.accentColor }}
          animate={{ width: `${((displayIdx + 1) / chapters.length) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* ── HINT ───────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 right-5 text-white/20 text-xs z-20 hidden md:block select-none">
        ← → or click a marker
      </div>
    </motion.div>
  );
}
