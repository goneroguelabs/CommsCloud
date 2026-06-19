"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type GlobeEvent = {
  id: string;
  title: string;
  detail: string;
  color: string;
  icon: "signal" | "switch" | "device" | "shield" | "globe";
};

type VisibleGlobeEvent = GlobeEvent & {
  position: GlobeNotificationPosition;
};

type GlobeNotificationPosition = {
  x: number;
  y: number;
  origin: string;
};

const EVENTS: readonly GlobeEvent[] = [
  { id: "sim-activated", title: "SIM activated", detail: "Kenya deployment online", color: "#F5A623", icon: "signal" },
  { id: "network-switched", title: "Network switched", detail: "Best operator selected", color: "#615a84", icon: "switch" },
  { id: "device-reconnected", title: "Device reconnected", detail: "Connection restored", color: "#1aa8a0", icon: "device" },
  { id: "private-apn", title: "Private APN secured", detail: "Data session protected", color: "#1B2A4A", icon: "shield" },
  { id: "roaming-updated", title: "Roaming profile updated", detail: "Coverage expanded", color: "#d74d8b", icon: "globe" },
];

const DESKTOP_POSITIONS = [
  { x: 6, y: 28, origin: "left top" },
  { x: 9, y: 68, origin: "left top" },
  { x: 20, y: 52, origin: "left top" },
  { x: 31, y: 35, origin: "left top" },
  { x: 35, y: 74, origin: "left top" },
  { x: 45, y: 21, origin: "left top" },
  { x: 50, y: 47, origin: "left top" },
] as const;

const MOBILE_POSITIONS = [
  { x: 6, y: 58, origin: "left top" },
  { x: 13, y: 32, origin: "left top" },
  { x: 20, y: 70, origin: "left top" },
] as const;

function pickPosition(
  usedPositions: readonly GlobeNotificationPosition[],
  isMobile: boolean,
) {
  const positions = isMobile ? MOBILE_POSITIONS : DESKTOP_POSITIONS;
  const available = positions.filter(
    (position) =>
      !usedPositions.some(
        (used) =>
          Math.abs(used.x - position.x) < 18 &&
          Math.abs(used.y - position.y) < 18,
      ),
  );
  const pool = available.length ? available : positions;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickEvents(
  previousIds: readonly string[],
  previousPositions: readonly VisibleGlobeEvent["position"][],
): VisibleGlobeEvent[] {
  const available = EVENTS.filter((event) => !previousIds.includes(event.id));
  const pool = available.length >= 2 ? available : [...EVENTS];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const count = isMobile ? 1 : Math.random() < 0.5 ? 1 : 2;
  const usedPositions: GlobeNotificationPosition[] = [...previousPositions];

  return shuffled.slice(0, count).map((event) => {
    const position = pickPosition(usedPositions, isMobile);
    usedPositions.push(position);
    return { ...event, position };
  });
}

export function GlobeNotifications() {
  const [visibleEvents, setVisibleEvents] = useState<VisibleGlobeEvent[]>([
    { ...EVENTS[0], position: DESKTOP_POSITIONS[3] },
  ]);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let timeout = 0;
    const schedule = () => {
      timeout = window.setTimeout(() => {
        setVisibleEvents((current) =>
          pickEvents(
            current.map((event) => event.id),
            current.map((event) => event.position),
          ),
        );
        setCycle((current) => current + 1);
        schedule();
      }, 4000 + Math.random() * 1000);
    };
    schedule();
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="globe-notifications" aria-hidden="true">
      {visibleEvents.map((event, index) => (
        <div
          key={`${cycle}-${event.id}`}
          className={`globe-notification globe-notification-${index + 1}`}
          style={
            {
              "--notification-x": `${event.position.x}%`,
              "--notification-y": `${event.position.y}%`,
              "--notification-origin": event.position.origin,
            } as CSSProperties
          }
        >
          <span className="globe-notification-icon" style={{ "--notification-color": event.color } as CSSProperties}>
            <EventIcon name={event.icon} />
          </span>
          <span className="globe-notification-copy">
            <strong>{event.title}</strong>
            <small>{event.detail}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

function EventIcon({ name }: { name: GlobeEvent["icon"] }) {
  const paths = {
    signal: "M5 15h2m2-4h2m2-4h2m2-4h2M5 19h14",
    switch: "M5 8h12l-3-3m3 3-3 3M19 16H7l3 3m-3-3 3-3",
    device: "M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 13h4",
    shield: "M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Zm-3 9 2 2 4-5",
    globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-18c2 2 3 5 3 9s-1 7-3 9m0-18c-2 2-3 5-3 9s1 7 3 9M3 12h18",
  } as const;
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={paths[name]} /></svg>;
}
