import { useState, useEffect, useRef } from 'react';
import {
  FaBrain as BrainIcon,
  FaBolt as BoltIcon,
  FaComments as CommentsIcon,
  FaChartLine as ChartLineIcon,
  FaSyncAlt as SyncIcon,
  FaCogs as CogsIcon,
} from 'react-icons/fa';

const DESKTOP_SIZE = 260;
const MOBILE_SIZE = 200;
const DEPTH = 130;

const faceLabels = {
  front: 'AI / ML',
  back: 'Data Science',
  right: 'Data Engineering',
  left: 'Backend APIs',
  top: 'Analytics',
  bottom: 'Automation',
};

const faceTransforms = {
  front: `translateZ(${DEPTH}px)`,
  back: `rotateY(180deg) translateZ(${DEPTH}px)`,
  right: `rotateY(90deg) translateZ(${DEPTH}px)`,
  left: `rotateY(-90deg) translateZ(${DEPTH}px)`,
  top: `rotateX(90deg) translateZ(${DEPTH}px)`,
  bottom: `rotateX(-90deg) translateZ(${DEPTH}px)`,
};

const services = [
  { icon: <BrainIcon />, title: 'Machine Learning Systems', description: 'Model training and deployment.' },
  { icon: <ChartLineIcon />, title: 'Data Analytics', description: 'Dashboards and forecasting.' },
  { icon: <SyncIcon />, title: 'Data Pipelines', description: 'ETL and SQL workflows.' },
  { icon: <CommentsIcon />, title: 'Backend APIs', description: 'Flask, Node, REST.' },
  { icon: <BoltIcon />, title: 'Time-Series Modeling', description: 'Volatility simulations.' },
  { icon: <CogsIcon />, title: 'Automation', description: 'Reporting and tooling.' },
];

const rotations = [
  { x: 0, y: 0 },
  { x: 0, y: 180 },
  { x: 0, y: 90 },
  { x: 0, y: -90 },
  { x: 90, y: 0 },
  { x: -90, y: 0 },
];

export default function ServicesWithCube() {
  const [active, setActive] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const cubeRef = useRef<HTMLDivElement | null>(null);

  const rotation = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  /* Detect mobile once */
  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  /* Intersection */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.35 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* Update target rotation */
  useEffect(() => {
    if (active !== null) target.current = rotations[active];
  }, [active]);

  /* Animation loop */
  useEffect(() => {
    let raf: number;

    const animate = () => {
      const r = rotation.current;
      const t = target.current;

      if (!isMobile && active === null && inView) {
        t.y += 0.05;
        t.x += 0.02;
      }

      r.x += (t.x - r.x) * 0.08;
      r.y += (t.y - r.y) * 0.08;

      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateX(${r.x}deg) rotateY(${r.y}deg)`;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, [active, inView, isMobile]);

  const SIZE = isMobile ? MOBILE_SIZE : DESKTOP_SIZE;

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 md:px-6 max-w-7xl mx-auto text-white
                 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
    >
      {/* SERVICES */}
      <div>
        <h2 className="text-3xl md:text-5xl font-bold mb-10">
          Systems Built on Data, Not Assumptions.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActive(active === i ? null : i)}
              onMouseEnter={!isMobile ? () => setActive(i) : undefined}
              onMouseLeave={!isMobile ? () => setActive(null) : undefined}
              className={`p-5 rounded-xl border text-left transition-colors
                ${
                  active === i
                    ? 'border-white/40 bg-white/10'
                    : 'border-white/20 bg-white/5'
                }`}
            >
              <div className="flex items-center gap-3 mb-2 text-base">
                {s.icon}
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <p className="text-neutral-400 text-sm">{s.description}</p>
            </button>
          ))}
        </div>

        {isMobile && (
          <p className="mt-6 text-xs text-gray-400">
            Tap a card to rotate the system model.
          </p>
        )}
      </div>

      {/* CUBE */}
      <div className="flex justify-center">
        <div style={{ perspective: '1200px' }} className="relative">
          {!isMobile && (
            <div className="absolute inset-0 rounded-full blur-3xl bg-white/10 scale-110" />
          )}

          <div
            style={{
              width: SIZE,
              height: SIZE,
              transform: `scale(${inView ? 1 : 0.8})`,
              transition: 'transform 0.5s ease',
            }}
          >
            <div
              ref={cubeRef}
              style={{
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
              }}
            >
              {Object.entries(faceLabels).map(([face, label]) => (
                <div
                  key={face}
                  className="absolute flex items-center justify-center text-xs md:text-sm font-semibold rounded-xl"
                  style={{
                    width: SIZE,
                    height: SIZE,
                    transform: faceTransforms[face as keyof typeof faceTransforms],
                    backfaceVisibility: 'hidden',
                    background:
                      'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
