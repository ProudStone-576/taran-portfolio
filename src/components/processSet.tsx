import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Problem Framing',
    description:
      'Define objectives, constraints, and success metrics. Convert vague requirements into structured analytical questions.',
  },
  {
    number: '02',
    title: 'Data Acquisition',
    description:
      'Collect data from databases, APIs, logs, or external sources. Validate integrity, schema, and coverage.',
  },
  {
    number: '03',
    title: 'Cleaning & Feature Engineering',
    description:
      'Handle missing values, normalize distributions, and engineer features that expose meaningful signal.',
  },
  {
    number: '04',
    title: 'Modeling & Analysis',
    description:
      'Apply statistical methods, machine learning models, and time-series techniques to extract insight.',
  },
  {
    number: '05',
    title: 'Deployment & Automation',
    description:
      'Deploy models and pipelines via APIs or scheduled workflows with monitoring and version control.',
  },
  {
    number: '06',
    title: 'Evaluation & Iteration',
    description:
      'Track performance, detect drift, and refine systems through continuous feedback and experimentation.',
  },
];

export default function ProcessSection() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [highlightedCell, setHighlightedCell] = useState<{ x: number; y: number } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cellSize = 40;

    if (mouseX < 0 || mouseY < 0 || mouseX > rect.width || mouseY > rect.height) {
      setHighlightedCell(null);
      return;
    }

    setHighlightedCell({
      x: Math.floor(mouseX / cellSize),
      y: Math.floor(mouseY / cellSize),
    });
  };

  return (
    <section
      ref={sectionRef}
      id="process"
      className="bg-black text-white py-20 px-4 md:px-12 relative overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHighlightedCell(null)}
      aria-label="Engineering Workflow Section"
    >
      {/* Base Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                           linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Highlighted Grid Lines */}
      {highlightedCell && (
        <>
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 bg-white"
            style={{
              left: highlightedCell.x * 40 + 1,
              width: 4,
              filter:
                'drop-shadow(0 0 8px rgba(255,255,255,0.9)) drop-shadow(0 0 20px rgba(255,255,255,0.6))',
              animation: 'glowPulse 2.5s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 bg-white"
            style={{
              top: highlightedCell.y * 40 + 1,
              height: 4,
              filter:
                'drop-shadow(0 0 8px rgba(255,255,255,0.9)) drop-shadow(0 0 20px rgba(255,255,255,0.6))',
              animation: 'glowPulse 2.5s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        </>
      )}

      {/* Title */}
      <div className="max-w-7xl mx-auto mb-20 text-center relative z-20">
        <div className="w-14 h-[2px] bg-white mx-auto mb-6" />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide"
        >
          Engineering Workflow
        </motion.h2>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 relative z-20">
        <div className="hidden md:block absolute top-0 right-[66.6%] h-full w-px bg-white/20" />
        <div className="hidden lg:block absolute top-0 right-[33.3%] h-full w-px bg-white/20" />

        {steps.map((step, index) => (
          <motion.article
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative flex flex-col h-full p-4 sm:p-6 rounded-lg"
            onMouseEnter={() => setHoveredStep(index)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div className="flex items-center mb-6">
              <div
                className={`w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-lg font-bold transition ${
                  hoveredStep === index
                    ? 'bg-white text-black scale-110'
                    : 'bg-transparent'
                }`}
              >
                {step.number}
              </div>
              <div className="ml-4 h-[2px] w-12 bg-white/30" />
            </div>

            <h3
              className={`text-xl sm:text-2xl font-bold mb-2 transition ${
                hoveredStep === index ? 'text-white' : 'text-gray-400'
              }`}
            >
              {step.title}
            </h3>

            <p className="text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </motion.article>
        ))}
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-1/4 -right-36 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -left-36 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

      <style>{`
        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.7;
            filter:
              drop-shadow(0 0 6px rgba(255,255,255,0.7))
              drop-shadow(0 0 16px rgba(255,255,255,0.4));
          }
          50% {
            opacity: 1;
            filter:
              drop-shadow(0 0 12px rgba(255,255,255,1))
              drop-shadow(0 0 28px rgba(255,255,255,0.7));
          }
        }
      `}</style>
    </section>
  );
}
