"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { chapters, Era } from "@/lib/story";

interface TimelineProps {
  currentIdx: number;
  onNavigate: (idx: number) => void;
}

// Build era groups in order
interface EraGroup {
  era: Era;
  indices: number[];
  color: string;
}

function buildEraGroups(): EraGroup[] {
  const groups: EraGroup[] = [];
  let current: EraGroup | null = null;
  chapters.forEach((ch, i) => {
    if (!current || current.era !== ch.era) {
      current = { era: ch.era, indices: [], color: ch.accentColor };
      groups.push(current);
    }
    current.indices.push(i);
  });
  return groups;
}

const ERA_GROUPS = buildEraGroups();

// Short labels for narrow screens
const ERA_SHORT: Record<Era, string> = {
  "Summer '21":   "Smr '21",
  "Sophomore Year": "Sophomore",
  "Summer '22":   "Smr '22",
  "Junior Year":  "Junior",
  "Summer '23":   "Smr '23",
  "Senior Year":  "Senior",
  "Graduation":   "Grad",
  "Long Distance":"Long Dist.",
  "NYC Together": "NYC",
  "Next Chapter": "Next →",
};

export default function Timeline({ currentIdx, onNavigate }: TimelineProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  // Keep active dot scrolled into view on narrow screens
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [currentIdx]);

  const currentChapter = chapters[currentIdx];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 select-none">
      {/* Gradient backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(2,2,16,0.98) 0%, rgba(2,2,16,0.92) 60%, transparent 100%)",
        }}
      />

      <div className="relative px-6 md:px-10 pt-6 pb-5">
        {/* Era section labels */}
        <div className="flex w-full mb-2">
          {ERA_GROUPS.map((group) => {
            const isActive = group.indices.includes(currentIdx);
            const widthPct = (group.indices.length / chapters.length) * 100;
            return (
              <div
                key={group.era}
                className="flex flex-col items-start overflow-hidden"
                style={{ width: `${widthPct}%` }}
              >
                <span
                  className="text-[10px] uppercase tracking-[0.14em] leading-none truncate pr-1 transition-all duration-300"
                  style={{
                    color: isActive ? group.color : "rgba(255,255,255,0.22)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {ERA_SHORT[group.era]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Timeline track + dots */}
        <div className="relative flex items-center w-full h-5">
          {/* Background track */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/10" />

          {/* Filled track up to current */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px]"
            style={{ background: currentChapter.accentColor }}
            animate={{ width: `${((currentIdx + 0.5) / chapters.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Era boundary ticks */}
          {ERA_GROUPS.map((group, gi) => {
            if (gi === 0) return null;
            const tickPct = (group.indices[0] / chapters.length) * 100;
            return (
              <div
                key={group.era + "-tick"}
                className="absolute top-1/2 -translate-y-1/2 w-[1px] h-3 bg-white/15"
                style={{ left: `${tickPct}%` }}
              />
            );
          })}

          {/* Chapter dots */}
          <div className="absolute inset-0 flex items-center">
            {chapters.map((ch, i) => {
              const isPast   = i < currentIdx;
              const isActive = i === currentIdx;
              return (
                <button
                  key={ch.id}
                  ref={isActive ? activeRef : undefined}
                  onClick={() => onNavigate(i)}
                  title={ch.title}
                  className="flex-1 flex items-center justify-center h-full group"
                >
                  <motion.div
                    animate={{
                      width:  isActive ? 11 : 5,
                      height: isActive ? 11 : 5,
                      backgroundColor: isActive
                        ? ch.accentColor
                        : isPast
                        ? "rgba(255,255,255,0.45)"
                        : "rgba(255,255,255,0.14)",
                    }}
                    transition={{ duration: 0.25 }}
                    className="rounded-full group-hover:scale-150 transition-transform duration-150"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Year labels aligned to era starts */}
        <div className="flex w-full mt-1.5">
          {ERA_GROUPS.map((group) => {
            const isActive = group.indices.includes(currentIdx);
            const widthPct = (group.indices.length / chapters.length) * 100;
            // Extract year from era name or first chapter date
            const firstCh = chapters[group.indices[0]];
            const yearMatch = firstCh.date.match(/\d{4}/);
            const year = yearMatch ? yearMatch[0] : "";
            return (
              <div
                key={group.era + "-yr"}
                className="overflow-hidden"
                style={{ width: `${widthPct}%` }}
              >
                <span
                  className="text-[9px] tabular-nums transition-colors duration-300"
                  style={{ color: isActive ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.15)" }}
                >
                  {year}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
