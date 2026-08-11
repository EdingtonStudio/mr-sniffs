'use client';

import { useEffect, useRef } from 'react';

/** Scroll-tied parallax for a decorative display numeral. Travels from its resting
 * position down to near the bottom of the nearest `[data-parallax-target]` element
 * (the hero photo) as that element scrolls through the viewport. Direct DOM writes
 * via requestAnimationFrame — a per-scroll React re-render isn't worth it here. */
export default function ParallaxNumeral({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = ref.current;
    const container = el?.closest('section')?.querySelector<HTMLElement>('[data-parallax-target]');
    if (!el || !container) return;

    let ticking = false;
    const update = () => {
      const rect = container.getBoundingClientRect();
      // Reach full travel about 65% of the way through the container's own height,
      // so the numeral is already near the bottom while the photo is still on screen.
      const progress = Math.min(Math.max(-rect.top / (rect.height * 0.65), 0), 1);
      const maxTravel = Math.max(rect.height - el.offsetHeight - 24, 0);
      el.style.transform = `translateY(${progress * maxTravel}px)`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <span ref={ref} className={className} aria-hidden="true">
      {value}
    </span>
  );
}
