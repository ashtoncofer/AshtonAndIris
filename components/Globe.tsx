"use client";

import { useEffect, useRef, useCallback } from "react";

interface GlobePoint {
  lat: number;
  lng: number;
  label: string;
  color: string;
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
  points: GlobePoint[];
  arc?: GlobeArc | null;
  activeColor: string;
}

export default function Globe({ targetLat, targetLng, points, arc, activeColor }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const GlobeGLRef = useRef<any>(null);

  const initGlobe = useCallback(async () => {
    if (!containerRef.current || globeRef.current) return;

    const GlobeGL = (await import("react-globe.gl")).default;
    GlobeGLRef.current = GlobeGL;

    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globe = (GlobeGL as any)()
      .width(w)
      .height(h)
      .backgroundColor("rgba(0,0,0,0)")
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
      .atmosphereColor("#4a90d9")
      .atmosphereAltitude(0.15)
      .showGraticules(false)
      .enablePointerInteraction(false);

    globe(containerRef.current);
    globeRef.current = globe;

    // Point to starting location immediately
    globe.pointOfView({ lat: targetLat, lng: targetLng, altitude: 2.0 }, 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    initGlobe();
  }, [initGlobe]);

  // Rotate to new target when it changes
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView({ lat: targetLat, lng: targetLng, altitude: 2.0 }, 1200);
  }, [targetLat, targetLng]);

  // Update points
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointsData(points)
      .pointLat("lat")
      .pointLng("lng")
      .pointColor((d: GlobePoint) => d.color)
      .pointAltitude(0.02)
      .pointRadius((d: GlobePoint) =>
        d.lat === targetLat && d.lng === targetLng ? 0.6 : 0.3
      )
      .pointLabel("label");
  }, [points, targetLat, targetLng]);

  // Update arc
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const arcs = arc ? [arc] : [];
    g.arcsData(arcs)
      .arcStartLat("startLat")
      .arcStartLng("startLng")
      .arcEndLat("endLat")
      .arcEndLng("endLng")
      .arcColor(() => [activeColor, "#ffffff"])
      .arcAltitude(0.25)
      .arcStroke(0.5)
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcDashAnimateTime(2000);
  }, [arc, activeColor]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const g = globeRef.current;
      const el = containerRef.current;
      if (!g || !el) return;
      g.width(el.clientWidth).height(el.clientHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
