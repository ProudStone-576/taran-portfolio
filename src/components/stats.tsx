import { useEffect, useState, useRef } from 'react';

interface StatBoxProps {
  end: number;
  label: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  description?: string;
}

export function StatBox({
  end,
  label,
  duration = 3000,
  prefix = '',
  suffix = '',
  description,
}: StatBoxProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let start = 0;
    const stepTime = Math.max(Math.floor(duration / end), 0.1);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [end, duration]);

  const formattedCount = count.toLocaleString();

  return (
    <div
      ref={elementRef}
      className="relative flex flex-col items-start justify-start space-y-4 p-8 rounded-xl border border-white 
                 transition-all duration-700 hover:shadow-xl overflow-hidden cursor-pointer 
                 backdrop-blur-sm w-full h-full group bg-black text-white"
    >
      <p className="relative text-5xl md:text-6xl font-bold tracking-tight group-hover:tracking-tighter z-10">
        {prefix}{formattedCount}{suffix}
      </p>

      <div className="relative z-10">
        <div className="w-16 h-0.5 bg-white mb-3 transition-all duration-700 group-hover:w-24" />
        <p className="text-lg font-medium tracking-wide">{label}</p>
      </div>

      {description && (
        <p className="relative z-10 text-sm mt-2 max-w-xs leading-relaxed text-white opacity-70">
          {description}
        </p>
      )}
    </div>
  );
}

export default function SlideShow() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      () => {
        // Handle intersection observer entries
      },      { threshold: 0.1 }    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full min-h-[300vh] relative">
      <section
        ref={statsRef}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-black text-white px-8 z-20"
      >
        <div className="text-center mb-16 max-w-2xl">
          <div className="w-16 h-0.5 bg-white mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">Our Foundation</h2>
          <p className="mt-4 text-white opacity-80">
            Metrics that define our approach before our first client engagement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl w-full px-4">
          <StatBox end={1200} label="Learning Hours" description="Collective knowledge building" />
          <StatBox end={42} label="Tools Mastered" description="Cutting-edge technologies explored" />
          <StatBox end={87} label="Prototypes Built" description="Concept validation exercises" />
          <StatBox end={15} suffix="k" label="Lines of Code" description="Infrastructure development" />
          <StatBox end={100} suffix="%" label="Commitment" description="To quality and innovation" />
        </div>
      </section>
    </div>
  );
}