"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface GlobeMarker {
  lat: number;
  lng: number;
  label: string;
  color: string;
  isActive: boolean;
  isVisited: boolean;
  chapterIdx: number;
}

interface GlobeArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

interface PersonPin {
  lat: number;
  lng: number;
  label: "A" | "I";
  color: string;
  name: string;
}

interface GlobeProps {
  targetLat: number;
  targetLng: number;
  altitude: number;
  markers: GlobeMarker[];
  arcs?: GlobeArc[];
  activeColor: string;
  personPins: PersonPin[];
  onMarkerClick?: (chapterIdx: number) => void;
}

export default function Globe({
  targetLat,
  targetLng,
  altitude,
  markers,
  arcs,
  activeColor,
  personPins,
  onMarkerClick,
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const [globeReady, setGlobeReady] = useState(false);

  // Init
  useEffect(() => {
    if (!containerRef.current || globeRef.current) return;
    let mounted = true;

    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = await import("globe.gl") as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const GlobeGL: any = mod.default ?? mod;
      if (!mounted || !containerRef.current) return;
      const el = containerRef.current;

      const globe = GlobeGL()
        .width(el.clientWidth)
        .height(el.clientHeight)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
        .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
        .atmosphereColor(activeColor)
        .atmosphereAltitude(0.22)
        .showGraticules(false);

      globe(el);
      globeRef.current = globe;
      if (mounted) setGlobeReady(true);

      // No auto-rotate — the chapter fly animation IS the motion
      const controls = globe.controls();
      controls.autoRotate = false;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI * 0.2;
      controls.maxPolarAngle = Math.PI * 0.8;

      globe.pointOfView({ lat: targetLat, lng: targetLng, altitude }, 0);
    })();

    return () => { mounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fly to new target whenever location or altitude changes
  useEffect(() => {
    globeRef.current?.pointOfView({ lat: targetLat, lng: targetLng, altitude }, 1400);
  }, [targetLat, targetLng, altitude]);

  // Atmosphere color
  useEffect(() => {
    globeRef.current?.atmosphereColor(activeColor);
  }, [activeColor]);

  // Chapter markers + rings
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const active = markers.find((m) => m.isActive);

    g.pointsData(markers)
      .pointLat("lat")
      .pointLng("lng")
      .pointColor((d: GlobeMarker) =>
        d.isActive ? "#ffffff" : d.isVisited ? `${d.color}cc` : "#ffffff33"
      )
      .pointAltitude((d: GlobeMarker) => (d.isActive ? 0.06 : 0.01))
      .pointRadius((d: GlobeMarker) => (d.isActive ? 0.65 : 0.25))
      .pointsMerge(false)
      .onPointClick((d: GlobeMarker) => onMarkerClick?.(d.chapterIdx));

    if (active) {
      g.ringsData([active])
        .ringLat("lat")
        .ringLng("lng")
        .ringColor(() => activeColor)
        .ringMaxRadius(4)
        .ringPropagationSpeed(2)
        .ringRepeatPeriod(1100);
    } else {
      g.ringsData([]);
    }
  }, [markers, activeColor, onMarkerClick, globeReady]);

  // Inject CSS keyframes for pin animation once
  useEffect(() => {
    if (document.getElementById("pin-entrance-style")) return;
    const style = document.createElement("style");
    style.id = "pin-entrance-style";
    style.textContent = `
      @keyframes pinEntrance {
        0%   { transform: scale(0.2) translateY(6px); opacity: 0; }
        65%  { transform: scale(1.25) translateY(-2px); opacity: 1; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      @keyframes pinPulse {
        0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 0 0px rgba(255,255,255,0.4); }
        50%       { box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 0 5px rgba(255,255,255,0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // A / I person pins as HTML elements
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;

    g.htmlElementsData(personPins)
      .htmlLat("lat")
      .htmlLng("lng")
      .htmlAltitude(0.04)
      .htmlElement((d: PersonPin) => {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          pointer-events: none;
          user-select: none;
        `;

        const badge = document.createElement("div");
        badge.style.cssText = `
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${d.color};
          border: 2px solid rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: white;
          font-family: system-ui, sans-serif;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
          animation: pinEntrance 0.45s cubic-bezier(0.22,1,0.36,1) forwards, pinPulse 2.5s ease-in-out 0.45s infinite;
        `;
        badge.textContent = d.label;

        const nameTag = document.createElement("div");
        nameTag.style.cssText = `
          font-size: 9px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          font-family: system-ui, sans-serif;
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
          letter-spacing: 0.05em;
          white-space: nowrap;
          animation: pinEntrance 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
          opacity: 0;
        `;
        nameTag.textContent = d.name;

        wrapper.appendChild(badge);
        wrapper.appendChild(nameTag);
        return wrapper;
      });
  }, [personPins, globeReady]);

  // Arcs
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.arcsData(arcs ?? [])
      .arcStartLat("startLat")
      .arcStartLng("startLng")
      .arcEndLat("endLat")
      .arcEndLng("endLng")
      .arcColor((d: GlobeArc) => [d.color, "#ffffffdd"])
      .arcAltitude(0.3)
      .arcStroke(1.0)
      .arcDashLength(0.45)
      .arcDashGap(0.22)
      .arcDashAnimateTime(1600);
  }, [arcs, globeReady]);

  // Resize
  useEffect(() => {
    const onResize = () => {
      const g = globeRef.current;
      const el = containerRef.current;
      if (g && el) g.width(el.clientWidth).height(el.clientHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
