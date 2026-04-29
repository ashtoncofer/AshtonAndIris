"use client";

import { useEffect, useRef, useCallback } from "react";

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

interface GlobeProps {
  targetLat: number;
  targetLng: number;
  markers: GlobeMarker[];
  arc?: GlobeArc | null;
  activeColor: string;
  onMarkerClick?: (chapterIdx: number) => void;
}

export default function Globe({
  targetLat,
  targetLng,
  markers,
  arc,
  activeColor,
  onMarkerClick,
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pauseAndFly = useCallback((lat: number, lng: number) => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls();
    controls.autoRotate = false;
    g.pointOfView({ lat, lng, altitude: 2.4 }, 1400);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      controls.autoRotate = true;
    }, 2800);
  }, []);

  // Init (runs once)
  useEffect(() => {
    if (!containerRef.current || globeRef.current) return;
    let mounted = true;

    (async () => {
      // globe.gl is the imperative factory; react-globe.gl wraps it as a React component
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
        .atmosphereAltitude(0.25)
        .showGraticules(false);

      globe(el);
      globeRef.current = globe;

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI * 0.2;
      controls.maxPolarAngle = Math.PI * 0.8;

      globe.pointOfView({ lat: targetLat, lng: targetLng, altitude: 2.4 }, 0);
    })();

    return () => { mounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fly to target whenever it changes
  useEffect(() => {
    if (globeRef.current) pauseAndFly(targetLat, targetLng);
  }, [targetLat, targetLng, pauseAndFly]);

  // Atmosphere color
  useEffect(() => {
    globeRef.current?.atmosphereColor(activeColor);
  }, [activeColor]);

  // Markers + rings
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const active = markers.find((m) => m.isActive);

    g.pointsData(markers)
      .pointLat("lat")
      .pointLng("lng")
      .pointColor((d: GlobeMarker) =>
        d.isActive ? "#ffffff" : d.isVisited ? `${d.color}bb` : "#ffffff44"
      )
      .pointAltitude((d: GlobeMarker) => (d.isActive ? 0.06 : 0.01))
      .pointRadius((d: GlobeMarker) => (d.isActive ? 0.7 : 0.28))
      .pointsMerge(false)
      .onPointClick((d: GlobeMarker) => onMarkerClick?.(d.chapterIdx));

    if (active) {
      g.ringsData([active, active]) // two staggered rings
        .ringLat("lat")
        .ringLng("lng")
        .ringColor(() => activeColor)
        .ringMaxRadius(4.5)
        .ringPropagationSpeed(1.8)
        .ringRepeatPeriod(1100);
    } else {
      g.ringsData([]);
    }
  }, [markers, activeColor, onMarkerClick]);

  // Arcs
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.arcsData(arc ? [arc] : [])
      .arcStartLat("startLat")
      .arcStartLng("startLng")
      .arcEndLat("endLat")
      .arcEndLng("endLng")
      .arcColor(() => [activeColor, "#ffffffdd"])
      .arcAltitude(0.32)
      .arcStroke(1.2)
      .arcDashLength(0.45)
      .arcDashGap(0.22)
      .arcDashAnimateTime(1600);
  }, [arc, activeColor]);

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
