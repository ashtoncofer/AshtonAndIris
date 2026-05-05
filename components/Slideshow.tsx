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

// NYC journey waypoints: NYC → Stanford → San Diego → Italy/Istanbul → Hawaii → NYC
const NYC_JOURNEY = [
  { lat: 40.7128, lng: -74.006,   altitude: 1.3 },
  { lat: 37.4275, lng: -122.1697, altitude: 1.1 },
  { lat: 32.7157, lng: -117.1611, altitude: 1.2 },
  { lat: 41.45,   lng: 20.7,      altitude: 2.2 },
  { lat: 20.7984, lng: -156.3319, altitude: 1.6 },
  { lat: 40.7128, lng: -74.006,   altitude: 1.3 },
] as const;

const NYC_LIFE_IDX = chapters.findIndex(c => c.id === "nyc-life");

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
  photoCount,
}: {
  photo: StoryPhoto;
  pos: { top: number; right: number; rot: number; w: number };
  delay: number;
  photoCount: number;
}) {
  // On mobile: shrink width + cap height so portrait images don't cover the globe pins.
  // On desktop the pixel pos.w is always smaller than the vw value so it has no effect.
  const mobileMaxW =
    photoCount <= 1 ? "40vw" : photoCount <= 2 ? "35vw" : "28vw";
  const mobileMaxH =
    photoCount <= 1 ? "max-sm:max-h-[35vh]" : photoCount <= 2 ? "max-sm:max-h-[28vh]" : "max-sm:max-h-[20vh]";

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
        maxWidth: mobileMaxW,
        rotate: pos.rot,
        zIndex: 20,
      }}
      className={`rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.65)] ring-1 ring-white/10 ${mobileMaxH}`}
    >
      {photo.video ? (
        <video
          src={photo.src}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "auto", display: "block", maxHeight: pos.w * 1.5 }}
        />
      ) : photo.placeholder ? (
        <div
          className="flex items-center justify-center bg-white/5"
          style={{ width: pos.w, height: Math.round(pos.w * 0.75) }}
        >
          <div className="text-center text-white/30">
            <div className="text-3xl mb-1">📷</div>
            <div className="text-xs">Photo coming soon</div>
          </div>
        </div>
      ) : (
        // width fixed, height auto — portrait images show their full height
        <Image
          src={photo.src}
          alt={photo.alt}
          width={pos.w}
          height={pos.w * 1.5}
          style={{ width: "100%", height: "auto", display: "block" }}
          sizes={`${pos.w}px`}
        />
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
      className="absolute top-[5%] right-[3%] sm:top-[18%] sm:right-[6%] z-20 flex flex-col items-center gap-3 sm:gap-5 text-center"
    >
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-red-500/20 max-sm:hidden"
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
        className="text-4xl sm:text-6xl relative z-10"
      >
        ✈️
      </motion.div>
      <div className="relative z-10 flex flex-col gap-1">
        <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase">Next Adventure</p>
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">Paris</h2>
        <p className="text-white/50 text-xs sm:text-sm">France</p>
      </div>
      <motion.div
        className="relative z-10 px-4 py-1 sm:px-5 sm:py-1.5 rounded-full text-xs font-semibold"
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
  const [journeyPhase, setJourneyPhase] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);

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

  // Reset any programmatic document scroll (e.g. from Timeline's scrollIntoView) on every slide change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [displayIdx]);

  // NYC journey auto-animation — play through once and stop at the last waypoint
  useEffect(() => {
    if (displayIdx !== NYC_LIFE_IDX || transitioning) {
      setJourneyPhase(0);
      return;
    }
    if (journeyPhase >= NYC_JOURNEY.length - 1) return;
    const timeout = setTimeout(() => {
      setJourneyPhase(p => p + 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [displayIdx, transitioning, journeyPhase]);

  const chapter = chapters[displayIdx];
  const pending = chapters[pendingIdx];
  const isFirst = displayIdx === 0;
  const isLast  = displayIdx === chapters.length - 1;

  const { month, year } = parseDate(chapter.date);

  // Skip the midpoint dot for split-location chapters — person pins already show where each person is
  const markers = chapters.flatMap((c, i) => {
    if (c.ashton && c.iris) return [];
    return [{ lat: c.lat, lng: c.lng, label: c.location.split(",")[0], color: c.accentColor, isActive: i === pendingIdx, isVisited: i < pendingIdx, chapterIdx: i }];
  });

  const arcs = (() => {
    if (!pending.travelFrom) return [];
    const { lat: fromLat, lng: fromLng } = pending.travelFrom;
    if (pending.ashton && pending.iris) {
      // People are heading to different places — show one arc per person
      return [
        { startLat: fromLat, startLng: fromLng, endLat: pending.ashton.lat, endLng: pending.ashton.lng, color: "#60a5fa" },
        { startLat: fromLat, startLng: fromLng, endLat: pending.iris.lat,   endLng: pending.iris.lng,   color: "#f9a8d4" },
      ];
    }
    return [{ startLat: fromLat, startLng: fromLng, endLat: pending.lat, endLng: pending.lng, color: pending.accentColor }];
  })();

  const ashtonPos = chapter.ashton ?? { lat: chapter.lat, lng: chapter.lng };
  const irisPos   = chapter.iris   ?? { lat: chapter.lat, lng: chapter.lng };
  const together  = !chapter.ashton && !chapter.iris;
  const personPins = [
    { lat: together ? ashtonPos.lat + 0.18 : ashtonPos.lat, lng: together ? ashtonPos.lng - 0.22 : ashtonPos.lng, label: "A" as const, color: "#60a5fa", name: "Ashton" },
    { lat: together ? irisPos.lat - 0.18 : irisPos.lat,     lng: together ? irisPos.lng + 0.22 : irisPos.lng,     label: "I" as const, color: "#f9a8d4", name: "Iris"   },
  ];

  // Override globe target and person pins for the journey animation slide
  const isJourneyActive = displayIdx === NYC_LIFE_IDX && !transitioning;
  const wp = NYC_JOURNEY[journeyPhase];
  const globeTargetLat = isJourneyActive ? wp.lat : pending.lat;
  const globeTargetLng = isJourneyActive ? wp.lng : pending.lng;
  const globeAltitude  = isJourneyActive ? wp.altitude : pending.altitude;
  const journeyArcs = (isJourneyActive && journeyPhase > 0) ? [{
    startLat: NYC_JOURNEY[journeyPhase - 1].lat,
    startLng: NYC_JOURNEY[journeyPhase - 1].lng,
    endLat: NYC_JOURNEY[journeyPhase].lat,
    endLng: NYC_JOURNEY[journeyPhase].lng,
    color: "#2471A3",
  }] : [];
  const globeArcs = isJourneyActive ? journeyArcs : arcs;
  const journeyPins = [
    { lat: wp.lat + 0.18, lng: wp.lng - 0.22, label: "A" as const, color: "#60a5fa", name: "Ashton" },
    { lat: wp.lat - 0.18, lng: wp.lng + 0.22, label: "I" as const, color: "#f9a8d4", name: "Iris"   },
  ];
  const globePersonPins = isJourneyActive ? journeyPins : personPins;

  const real = chapter.photos.filter((p) => !p.placeholder && p.src);
  const displayPhotos = real.length > 0 ? real.slice(0, 4) : chapter.photos.slice(0, 1);
  const layout = getLayout(displayPhotos.length);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-[#020210] text-white"
      onPointerDown={(e) => {
        swipeStartX.current = e.clientX;
        swipeStartY.current = e.clientY;
      }}
      onPointerUp={(e) => {
        if (swipeStartX.current === null) return;
        const dx = e.clientX - swipeStartX.current;
        const dy = e.clientY - (swipeStartY.current ?? e.clientY);
        swipeStartX.current = null;
        swipeStartY.current = null;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
          if (dx < 0) next();
          else prev();
        }
      }}
    >
      {/* Globe — z-index:0 creates a stacking context so the WebGL canvas is contained within it */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <Suspense fallback={<div className="w-full h-full bg-[#020210]" />}>
          <Globe
            targetLat={globeTargetLat}
            targetLng={globeTargetLng}
            altitude={globeAltitude}
            markers={markers}
            arcs={globeArcs}
            activeColor={chapter.accentColor}
            personPins={globePersonPins}
            onMarkerClick={navigateTo}
          />
        </Suspense>
      </div>

      {/* Mobile: tall bottom gradient so text is readable over globe */}
      <div
        className="sm:hidden absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ zIndex: 1, height: "65%", background: "linear-gradient(to top, rgba(2,2,16,1) 0%, rgba(2,2,16,0.98) 35%, rgba(2,2,16,0.55) 62%, transparent 100%)" }}
      />
      {/* Desktop: left-to-right gradient */}
      <div
        className="hidden sm:block absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, background: "linear-gradient(to right, rgba(2,2,16,0.98) 0%, rgba(2,2,16,0.96) 26%, rgba(2,2,16,0.5) 38%, rgba(2,2,16,0.06) 52%, transparent 62%)" }}
      />
      {/* Desktop: bottom gradient (covers timeline area) */}
      <div
        className="hidden sm:block absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{ zIndex: 1, background: "linear-gradient(to top, rgba(2,2,16,0.98) 0%, transparent 100%)" }}
      />


      {/* ── Left text content ─── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end sm:justify-center px-5 sm:px-10 md:px-14 pb-28 sm:pb-0 pointer-events-none">
        {/* Site label */}
        <div className="absolute top-6 left-5 sm:left-10 md:left-14 flex items-center gap-2 text-white/25 text-xs tracking-widest uppercase">
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
            className="flex flex-col gap-2 sm:gap-3 lg:gap-4 max-w-[440px] pointer-events-auto"
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
              <span className="text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase text-white/40 font-medium">
                {month}
              </span>
              {year ? (
                <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white/90 tracking-tight leading-none">
                  {year}
                </span>
              ) : (
                <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white/10 tracking-tight leading-none select-none">
                  ????
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight">
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
                <PhotoCard key={i} photo={photo} pos={layout[i]} delay={i * 0.08} photoCount={displayPhotos.length} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Timeline ─── */}
      <Timeline currentIdx={displayIdx} onNavigate={navigateTo} />
    </div>
  );
}
