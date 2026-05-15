import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    (window as unknown as { __lenis: Lenis }).__lenis = lenis;

    const root = document.documentElement;
    let targetVel = 0;
    let currentVel = 0;
    let smoothedDir = 1;
    let prevDir = 1;

    lenis.on('scroll', ({ velocity, direction }: { velocity: number; direction: number }) => {
      ScrollTrigger.update();
      targetVel = velocity;
      if (direction !== 0 && direction !== smoothedDir) {
        smoothedDir = direction;
        if (smoothedDir !== prevDir) {
          prevDir = smoothedDir;
          window.dispatchEvent(new CustomEvent('scroll-dir', { detail: smoothedDir }));
        }
      }
    });

    let velRaf = 0;
    const decayTick = () => {
      currentVel += (targetVel - currentVel) * 0.18;
      // Decay the target itself so when Lenis stops emitting, it drains to zero
      targetVel *= 0.88;
      // Snap small to zero to avoid permanent micro-skew
      if (Math.abs(currentVel) < 0.05) currentVel = 0;
      if (Math.abs(targetVel) < 0.05) targetVel = 0;

      const clamped = Math.max(-50, Math.min(50, currentVel));
      root.style.setProperty('--scroll-vel', clamped.toFixed(2));
      root.style.setProperty('--scroll-vel-abs', Math.abs(clamped).toFixed(2));
      root.style.setProperty('--scroll-dir', String(smoothedDir));

      velRaf = requestAnimationFrame(decayTick);
    };
    velRaf = requestAnimationFrame(decayTick);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(velRaf);
      else velRaf = requestAnimationFrame(decayTick);
    };
    document.addEventListener('visibilitychange', onVis);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
        setTimeout(() => ScrollTrigger.refresh(), 600);
      });
    }

    return () => {
      cancelAnimationFrame(velRaf);
      document.removeEventListener('visibilitychange', onVis);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
