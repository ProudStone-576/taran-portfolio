import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: boolean;
};

export default function SplitReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.06,
  trigger = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const lines = ref.current.querySelectorAll<HTMLElement>('.reveal-line > span');
    if (!lines.length) return;

    gsap.set(lines, { yPercent: 110 });

    const anim = gsap.to(lines, {
      yPercent: 0,
      duration: 1,
      ease: 'expo.out',
      stagger,
      delay,
      paused: trigger,
    });

    if (!trigger) return;

    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      onEnter: () => anim.play(),
    });

    return () => {
      st.kill();
      anim.kill();
    };
  }, [delay, stagger, trigger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
