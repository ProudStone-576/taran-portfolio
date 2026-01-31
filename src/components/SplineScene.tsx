import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { StatBox } from './stats';

export default function SlideShow() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // Slide 1 motion
  const titleY = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, -80]), {
    stiffness: 120,
    damping: 30,
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.25]);

  const splineRotate = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0, 8]),
    { stiffness: 80, damping: 20 }
  );

  // Slide 2 background inversion
  const bgColor = useTransform(
    scrollYProgress,
    [0.45, 0.65],
    ['#ffffff', '#000000']
  );

  return (
    <>
      <style>{`
        .slide-container {
          height: 100vh;
          overflow-y: auto;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;
        }

        .slide-container::-webkit-scrollbar {
          display: none;
        }

        .slide {
          height: 100vh;
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        iframe {
          pointer-events: none;
        }

        /* MOBILE: disable nested scroll + snap */
        @media (max-width: 768px) {
          .slide-container {
            height: auto;
            scroll-snap-type: none;
          }

          .slide {
            height: auto;
            min-height: calc(100vh - 5rem);
          }
        }
      `}</style>

      <motion.div ref={containerRef} className="slide-container">

        {/* ================= SLIDE 1 ================= */}
        <section
          className="
            slide
            relative
            flex flex-col md:flex-row
            bg-black text-white
            overflow-hidden
            min-h-[calc(100vh-5rem)]
            md:h-screen
            pt-20 md:pt-0
          "
        >
          {/* Spline — DESKTOP ONLY */}
          <motion.div
            className="hidden md:block md:w-1/2 h-full"
            style={{ rotateZ: splineRotate }}
          >
            <Spline scene="https://prod.spline.design/gzXganLZNh2ArFaN/scene.splinecode" />
          </motion.div>

          {/* Text */}
          <motion.div
            className="
              w-full md:w-1/2
              flex flex-col
              justify-start md:justify-center
              px-6 md:px-10
            "
            style={{ y: titleY, opacity: textOpacity }}
          >
            <div className="w-12 h-0.5 bg-white mb-6" />

            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
              Engineered Growth
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-6">
              {[
                'Systems over slogans.',
                'Models over guesswork.',
                'Results over noise.',
              ].map((line, i) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <p className="text-gray-300 max-w-xl text-sm md:text-base">
              I build data-driven systems that learn, adapt, and scale.
              No funnels. No hacks. Just engineered outcomes.
            </p>
          </motion.div>

          {/* Mobile-only vertical scroll indicator (below content, centered) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:hidden pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        </section>

        {/* ================= SLIDE 2 ================= */}
        <motion.section
          className="slide flex flex-col items-center justify-center px-6 md:px-10"
          style={{ backgroundColor: bgColor }}
        >
          <motion.div
            className="text-center mb-16 max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-0.5 bg-current mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Quantified Reality
            </h2>
            <p className="mt-4 opacity-70 text-sm md:text-base">
              These numbers exist because systems were built.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl w-full">
            {[
              { end: 10000, suffix: '+', label: 'Sessions Analyzed' },
              { end: 8, suffix: '+', label: 'Systems Built' },
              { end: 40, suffix: '%', label: 'Time Reduced' },
              { end: 100000, suffix: '+', label: 'Synthetic Records' },
              { end: 18, suffix: '%', label: 'Risk Improvement' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <StatBox {...stat} />
              </motion.div>
            ))}
          </div>
        </motion.section>

      </motion.div>
    </>
  );
}
