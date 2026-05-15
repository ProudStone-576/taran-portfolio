import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  text: string;
  className?: string;
  highlight?: string[];
};

export default function WordReveal({ text, className = '', highlight = [] }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('[data-word]', ref.current!);

      gsap.set(words, { color: 'rgba(245, 241, 234, 0.16)' });

      gsap.to(words, {
        color: 'rgba(245, 241, 234, 1)',
        ease: 'none',
        stagger: { each: 0.04, from: 'start' },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
          end: 'bottom 55%',
          scrub: 0.6,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((word, i) => {
        const isHighlight = highlight.some((h) => word.toLowerCase().includes(h.toLowerCase()));
        return (
          <span
            key={i}
            data-word
            className={`inline-block transition-colors ${isHighlight ? 'italic text-acid' : ''}`}
            style={{ marginRight: '0.25em' }}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
}
