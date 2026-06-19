"use client";

import { useEffect, useRef, useState } from "react";

type CountUpStat = {
  label: string;
  value: number;
  suffix?: string;
};

export function CountUpStats({
  stats,
  variant = "default",
}: {
  stats: CountUpStat[];
  variant?: "default" | "hero";
}) {
  const rootRef = useRef<HTMLDListElement | null>(null);
  const skipAnimationRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      skipAnimationRef.current = true;
      requestAnimationFrame(() => {
        setProgress(1);
        setVisible(true);
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.32 },
    );

    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (skipAnimationRef.current) {
      return;
    }

    let frame = 0;
    const duration = 1150;
    const start = performance.now();

    const tick = (now: number) => {
      const raw = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);

      setProgress(eased);

      if (raw < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [visible]);

  return (
    <dl
      ref={rootRef}
      className={`stats-showcase stats-showcase-${variant}`}
      data-reveal="up"
    >
      {stats.map((stat) => {
        const value = Math.round(stat.value * progress);

        return (
          <div key={stat.label} className="stats-showcase-item">
            {variant === "hero" ? (
              <>
                <dd>
                  {value}
                  {stat.suffix}
                </dd>
                <dt>{stat.label}</dt>
              </>
            ) : (
              <>
                <dt>{stat.label}</dt>
                <dd>
                  {value}
                  {stat.suffix}
                </dd>
              </>
            )}
          </div>
        );
      })}
    </dl>
  );
}
