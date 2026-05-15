import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setTimeout(() => setDone(true), 450);
      }
      setProgress(Math.floor(p));
    }, 90);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] bg-ink flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-0 noise-bg opacity-[0.04]" />

          <div className="relative flex flex-col items-center gap-8 px-6">
            <div className="mono text-xs uppercase tracking-[0.4em] text-bone/60">
              Initializing system
            </div>

            <div className="display text-[18vw] sm:text-[14vw] md:text-[10vw] leading-none text-bone">
              {String(progress).padStart(3, '0')}
            </div>

            <div className="w-[260px] sm:w-[420px] h-px bg-bone/15 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-acid"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: 'linear' }}
              />
            </div>

            <div className="mono text-[10px] text-bone/40 uppercase tracking-widest">
              taran.matharu / portfolio.v2
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
