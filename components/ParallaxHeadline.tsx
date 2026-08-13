'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/* Drifts the hero headline on scroll by exposing a --parallax custom property.
   The transform itself lives in CSS, so mobile (where the headline is static)
   can opt out with a plain media query. */
export default function ParallaxHeadline({
  children,
  className,
  speed = 0.35,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty('--parallax', `${window.scrollY * speed}px`);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  );
}
