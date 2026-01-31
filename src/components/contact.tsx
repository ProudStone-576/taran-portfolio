import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function Contact() {
  const ref = useRef<HTMLElement | null>(null);

  // scroll progress for this section: 0 = not visible, 1 = fully passed
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'], // map when section enters/exits viewport
  });

  // smooth transforms driven by scroll progress
  const rawYBlob1 = useTransform(scrollYProgress, [0, 1], [60, -40]);
  const rawYBlob2 = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const rawHeaderY = useTransform(scrollYProgress, [0, 0.2, 0.45], [40, 10, 0]);
  const rawHeaderOpacity = useTransform(scrollYProgress, [0, 0.15, 0.35], [0, 0.7, 1]);
  const rawCardsY = useTransform(scrollYProgress, [0, 0.25, 0.5], [30, 8, 0]);
  const rawFormY = useTransform(scrollYProgress, [0, 0.3, 0.6], [40, 8, 0]);
  const rawFormOpacity = useTransform(scrollYProgress, [0, 0.35, 0.6], [0, 0.6, 1]);

  // apply spring for organic movement
  const blob1Y = useSpring(rawYBlob1, { stiffness: 120, damping: 20 });
  const blob2Y = useSpring(rawYBlob2, { stiffness: 120, damping: 20 });
  const headerY = useSpring(rawHeaderY, { stiffness: 140, damping: 30 });
  const headerOpacity = useSpring(rawHeaderOpacity, { stiffness: 140, damping: 30 });
  const cardsY = useSpring(rawCardsY, { stiffness: 140, damping: 30 });
  const formY = useSpring(rawFormY, { stiffness: 140, damping: 30 });
  const formOpacity = useSpring(rawFormOpacity, { stiffness: 140, damping: 30 });


  const variants = {
    active: {
      backgroundColor: "#f00"
    },
    inactive: {
      backgroundColor: "#fff",
      transition: { duration: 2 }
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="bg-black text-white py-20 px-4 sm:px-6 md:px-12 relative overflow-hidden"
      aria-label="Contact"
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                           linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Parallax blobs */}
      <motion.div
        style={{ y: blob1Y }}
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        aria-hidden="true"
      />
      <motion.div
        style={{ y: blob2Y }}
        className="absolute top-14 right-6 w-40 h-40 bg-white/6 rounded-full blur-2xl z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Header (parallax + fade in) */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-14 relative z-10"
        style={{ y: headerY, opacity: headerOpacity }}
      >
        <div className="w-16 h-0.5 bg-white mx-auto mb-6" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-widest">
          Contact
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          // subtle micro interaction on hover
          whileHover={{ scale: 1.01 }}
          className="text-gray-400 mt-4 max-w-xl mx-auto"
        >
          Technical collaboration, research discussions, or system-level work.
        </motion.p>
      </motion.div>

      {/* Contact Info - cards reveal with stagger */}
      <motion.div
        className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-400 mb-12 relative z-10"
        style={{ y: cardsY }}
      >
        {[
          {
            title: 'Email',
            content: (
              <a
                href="mailto:taranjeetsinghmatharu15@gmail.com"
                className="text-white hover:underline"
              >
                taranmatharu@gmail.com
              </a>
            ),
          },
          {
            title: 'Phone',
            content: (
              <a href="tel:+12366328270" className="text-white hover:underline">
                +1 (236) 632-8270
              </a>
            ),
          },
          {
            title: 'Location',
            content: <p>Abbotsford, BC, Canada</p>,
          },
        ].map(({ title, content }, i) => (
          <motion.div
            key={title}
            className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            custom={i}
            aria-hidden={false}
          >
            <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
            {content}
          </motion.div>
        ))}
      </motion.div>

      {/* Form - slide up into view, smooth */}
      <motion.form
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.9, 0.25, 1] }}
        viewport={{ once: true, amount: 0.35 }}
        action="https://formsubmit.co/taranjeetsinghmatharu15@gmail.com"
        method="POST"
        className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
        style={{ y: formY, opacity: formOpacity }}
      >
        <input type="hidden" name="_next" value="https://taranmatharu.com/thank-you" />
        <input type="text" name="_honey" className="hidden" autoComplete="off" />

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="bg-white/10 text-white placeholder-gray-400 px-6 py-4 rounded-lg outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Your name"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="bg-white/10 text-white placeholder-gray-400 px-6 py-4 rounded-lg outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Your email"
        />

        <textarea
          name="message"
          placeholder="Describe the problem, idea, or system."
          rows={5}
          required
          className="bg-white/10 text-white placeholder-gray-400 px-6 py-4 rounded-lg outline-none focus:ring-2 focus:ring-white/30 md:col-span-2"
          aria-label="Message"
        />

        <div className="md:col-span-2 flex justify-center">
          <motion.button
            type="submit"
            className="bg-white text-black px-10 py-4 rounded-lg font-semibold"
            variants={variants}
            whileHover="active"
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            aria-label="Send inquiry"
          >
            Send Inquiry
          </motion.button>
        </div>
      </motion.form>

      {/* Ambient glows */}
      <motion.div
        style={{ y: blob2Y }}
        className="absolute top-1/4 -right-36 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <motion.div
        style={{ y: blob1Y }}
        className="absolute bottom-1/3 -left-36 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <style>{`
        /* subtle focus for keyboard users */
        :focus { outline: none; }
        form :focus { box-shadow: 0 0 0 4px rgba(255,255,255,0.04); border-radius: 8px; }

        /* small performance-friendly reduction for mobile */
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </section>
  );
}
