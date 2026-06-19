"use client";

import { useEffect, useRef } from "react";
import { GlobeNotifications } from "@/components/home/globe-notifications";

type GeoPoint = {
  latitude: number;
  longitude: number;
  marker?: boolean;
};

type Coordinate = readonly [number, number];

const CONTINENTS: readonly (readonly Coordinate[])[] = [
  [
    [-168, 66], [-153, 59], [-141, 59], [-132, 52], [-124, 49],
    [-117, 33], [-107, 25], [-97, 18], [-84, 9], [-77, 9],
    [-80, 26], [-70, 44], [-60, 51], [-53, 58], [-66, 72],
    [-96, 82], [-132, 72],
  ],
  [
    [-81, 12], [-70, 10], [-52, 5], [-35, -7], [-43, -23],
    [-54, -35], [-66, -55], [-76, -42], [-81, -8],
  ],
  [
    [-10, 36], [-17, 15], [-8, 4], [8, -4], [12, -18],
    [28, -35], [41, -19], [51, 12], [39, 30], [25, 37], [8, 36],
  ],
  [
    [-10, 36], [-8, 50], [4, 59], [20, 70], [50, 72], [77, 76],
    [104, 76], [135, 67], [163, 61], [180, 52], [162, 43],
    [146, 46], [135, 35], [122, 24], [108, 8], [98, 6], [91, 22],
    [78, 8], [67, 24], [52, 27], [40, 42], [28, 41], [18, 45],
    [8, 43],
  ],
  [
    [112, -11], [130, -12], [142, -20], [153, -28], [146, -40],
    [130, -35], [116, -27],
  ],
  [
    [-52, 59], [-39, 64], [-28, 72], [-38, 82], [-57, 83], [-69, 75],
  ],
  [
    [46, -12], [51, -16], [50, -26], [44, -25],
  ],
];

const MARKERS: readonly GeoPoint[] = [
  { latitude: 6.5, longitude: 3.4, marker: true },
  { latitude: -1.3, longitude: 36.8, marker: true },
  { latitude: -26.2, longitude: 28, marker: true },
  { latitude: 25.2, longitude: 55.3, marker: true },
  { latitude: 19.1, longitude: 72.9, marker: true },
];

function isInsidePolygon(longitude: number, latitude: number, polygon: readonly Coordinate[]) {
  let inside = false;

  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const [x, y] = polygon[index];
    const [previousX, previousY] = polygon[previous];
    const intersects =
      y > latitude !== previousY > latitude &&
      longitude < ((previousX - x) * (latitude - y)) / (previousY - y) + x;

    if (intersects) inside = !inside;
  }

  return inside;
}

function buildLandPoints(): GeoPoint[] {
  const points: GeoPoint[] = [];
  const latitudeStep = 1.65;
  const longitudeStep = 1.65;

  for (let latitude = -55; latitude <= 78; latitude += latitudeStep) {
    const offset =
      Math.round((latitude + 55) / latitudeStep) % 2 === 0
        ? 0
        : longitudeStep / 2;

    for (let longitude = -178 + offset; longitude <= 180; longitude += longitudeStep) {
      if (CONTINENTS.some((polygon) => isInsidePolygon(longitude, latitude, polygon))) {
        points.push({ latitude, longitude });
      }
    }
  }

  return [...points, ...MARKERS];
}

const LAND_POINTS = buildLandPoints();
const TO_RADIANS = Math.PI / 180;
const INITIAL_ROTATION = -72 * TO_RADIANS;
const ROTATION_SPEED = 0.00046;

export function DottedGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let startTime = performance.now();
    let pausedAt = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const radius = Math.min(width, height) * 0.46;
      const centerX = width * 0.51;
      const centerY = height * 0.51;
      const elapsed = reducedMotion.matches ? 0 : time - startTime;
      const rotation = INITIAL_ROTATION + elapsed * ROTATION_SPEED;
      const tilt = 10 * TO_RADIANS;
      const projected: Array<{
        x: number;
        y: number;
        z: number;
        size: number;
        marker: boolean;
      }> = [];

      for (const point of LAND_POINTS) {
        const latitude = point.latitude * TO_RADIANS;
        const longitude = point.longitude * TO_RADIANS + rotation;
        const cosLatitude = Math.cos(latitude);
        const sphereX = cosLatitude * Math.sin(longitude);
        const sphereY = Math.sin(latitude);
        const sphereZ = cosLatitude * Math.cos(longitude);
        const tiltedY = sphereY * Math.cos(tilt) - sphereZ * Math.sin(tilt);
        const tiltedZ = sphereY * Math.sin(tilt) + sphereZ * Math.cos(tilt);

        if (tiltedZ < -0.2) continue;

        const perspective = 0.88 + tiltedZ * 0.12;
        projected.push({
          x: centerX + sphereX * radius * perspective,
          y: centerY - tiltedY * radius * perspective,
          z: tiltedZ,
          size: point.marker ? 4.6 : Math.max(0.44, 0.76 + tiltedZ * 0.56),
          marker: Boolean(point.marker),
        });
      }

      projected.sort((a, b) => a.z - b.z);

      for (const point of projected) {
        const opacity = point.marker ? 1 : Math.max(0.12, 0.28 + point.z * 0.5);
        context.beginPath();
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fillStyle = point.marker
          ? "rgba(250, 166, 26, 0.98)"
          : `rgba(97, 90, 132, ${opacity})`;

        if (point.marker) {
          context.shadowColor = "rgba(250, 166, 26, 0.72)";
          context.shadowBlur = 16;
        }

        context.fill();
        context.shadowBlur = 0;
      }
    };

    const animate = (time: number) => {
      draw(time);
      if (!reducedMotion.matches && !document.hidden) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const restart = () => {
      cancelAnimationFrame(animationFrame);
      resize();
      draw(performance.now());

      if (!reducedMotion.matches && !document.hidden) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        pausedAt = performance.now();
        cancelAnimationFrame(animationFrame);
        return;
      }

      if (pausedAt) startTime += performance.now() - pausedAt;
      pausedAt = 0;
      restart();
    };

    const resizeObserver = new ResizeObserver(restart);
    resizeObserver.observe(canvas);
    reducedMotion.addEventListener("change", restart);
    document.addEventListener("visibilitychange", handleVisibility);
    restart();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", restart);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="dotted-globe-shell" aria-hidden="true">
      <canvas ref={canvasRef} className="dotted-globe-canvas" />
      <GlobeNotifications />
    </div>
  );
}
