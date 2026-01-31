import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full bg-black text-white overflow-hidden px-6 md:px-16"
    >
      {/* Ambient background (reduced cost) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-8 w-[320px] h-[260px] bg-white/10 rounded-[60%_40%_55%_45%] blur-2xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-[360px] h-[300px] bg-white/5 rounded-[50%_50%_40%_60%] blur-2xl opacity-40" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col justify-center gap-12">

        {/* Identity */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            About Me
          </h2>

          <p className="mt-6 text-base md:text-xl text-gray-400 leading-relaxed max-w-xl">
            I build data-driven systems that observe reality, reduce uncertainty,
            and improve through feedback. Tools matter only when thinking is sound.
          </p>
        </motion.div>

        {/* Principle card (inline on mobile, floating on desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="
            w-full max-w-xl
            md:absolute md:right-24 md:top-1/3
            bg-white/5 border border-white/10
            rounded-2xl p-6 md:p-8
            backdrop-blur-md
          "
        >
          <blockquote className="text-lg md:text-2xl text-gray-200 leading-relaxed">
            <span className="italic">“Technology is nothing.</span>
            <br />
            <span className="italic">
              What matters is faith in people —
            </span>
            <br />
            <span className="italic">
              and giving them tools that obey intelligence.”
            </span>
          </blockquote>

          <div className="mt-4 text-xs uppercase tracking-widest text-gray-400">
            Principle
          </div>
        </motion.div>

        {/* Identity marker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="
            self-start
            bg-white/10 px-5 py-2 rounded-full
            text-xs uppercase tracking-widest
            border border-white/10
          "
        >
          Systems Thinking · Data · AI
        </motion.div>
      </div>
    </section>
  );
}
