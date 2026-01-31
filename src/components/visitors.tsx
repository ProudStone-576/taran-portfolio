import React, { JSX, useCallback, useEffect, useRef, useState } from "react";

/**
 * VisitorsBook
 * - Big animated background canvas where saved signatures endlessly float across the screen.
 * - Small drawing pad where a visitor can draw a signature (mouse/touch), submit it.
 * - Signatures persist to localStorage.
 *
 * Drop into any page. Requires Tailwind (class names can be replaced).
 */

type Point = { x: number; y: number; t: number };
type Stroke = Point[];
type Signature = Stroke[];

// localStorage key
const STORAGE_KEY = "visitors.signatures.v1";

// amount of floating agents on screen (duplicates from saved signatures)
const INITIAL_AGENTS = 18;

export default function VisitorsBook(): JSX.Element {
  const bgRef = useRef<HTMLCanvasElement | null>(null); // animated background canvas
  const drawRef = useRef<HTMLCanvasElement | null>(null); // drawing canvas overlay for input
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const [signatures, setSignatures] = useState<Signature[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Signature[];
    } catch {
      return [];
    }
  });

  // current drawing strokes (one signature may have multiple strokes)
  const strokesRef = useRef<Signature>([]);
  const drawing = useRef(false);

  // agents represent moving instances of saved signatures across screen
  type Agent = {
    sigIndex: number;
    x: number;
    y: number;
    speed: number;
    scale: number;
    angle: number;
    width: number;
    height: number;
    dir: number; // 1 left->right or -1 right->left
  };
  const agentsRef = useRef<Agent[]>([]);

  // canvas sizing util
  const resizeCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  // compute signature bounding box (for rendering and sizing)
  const signatureBounds = (sig: Signature) => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const stroke of sig) {
      for (const p of stroke) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      }
    }
    if (!isFinite(minX)) return { w: 60, h: 20 }; // fallback
    return { w: Math.max(10, maxX - minX), h: Math.max(6, maxY - minY) };
  };

  // draw a signature to a given context at (cx, cy) with scale and rotation
  const drawSignature = (
    ctx: CanvasRenderingContext2D,
    sig: Signature,
    cx: number,
    cy: number,
    scale = 1,
    angle = 0,
    strokeColor = "rgba(0,0,0,0.9)"
  ) => {
    if (!sig || sig.length === 0) return;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2 / Math.max(scale, 0.6);

    // center signature
    const bounds = signatureBounds(sig);
    const offsetX = -bounds.w / 2;
    const offsetY = -bounds.h / 2;

    for (const stroke of sig) {
      if (stroke.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x + offsetX, stroke[0].y + offsetY);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x + offsetX, stroke[i].y + offsetY);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  // spawn agents from existing signatures to fill the screen
  const repopulateAgents = useCallback(() => {
    const bg = bgRef.current;
    if (!bg) return;
    const ctx = bg.getContext("2d");
    if (!ctx) return;
    const W = bg.clientWidth;
    const H = bg.clientHeight;
    const agents: Agent[] = [];
    if (signatures.length === 0) {
      // sample placeholder scribbles so it isn't empty
      for (let i = 0; i < INITIAL_AGENTS; i++) {
        agents.push({
          sigIndex: 0,
          x: Math.random() * W,
          y: Math.random() * H,
          speed: 8 + Math.random() * 30,
          scale: 0.6 + Math.random() * 1.2,
          angle: (Math.random() * 40 - 20),
          width: 60,
          height: 26,
          dir: Math.random() > 0.5 ? 1 : -1,
        });
      }
      agentsRef.current = agents;
      return;
    }

    // create many agents mapped to saved signatures (duplicates allowed)
    for (let i = 0; i < INITIAL_AGENTS; i++) {
      const idx = Math.floor(Math.random() * signatures.length);
      const { w, h } = signatureBounds(signatures[idx]);
      agents.push({
        sigIndex: idx,
        x: Math.random() * W,
        y: Math.random() * H,
        speed: 12 + Math.random() * 40,
        scale: Math.max(0.5, Math.min(1.6, 120 / Math.max(w, h))),
        angle: Math.random() * 30 - 15,
        width: w,
        height: h,
        dir: Math.random() > 0.5 ? 1 : -1,
      });
    }
    agentsRef.current = agents;
  }, [signatures]);

  // animation loop: move agents and render signatures
  const animate = (ts: number) => {
    const bg = bgRef.current;
    if (!bg) return;
    if (lastTsRef.current === null) lastTsRef.current = ts;
    const dt = Math.min(50, ts - lastTsRef.current); // ms
    lastTsRef.current = ts;

    const ctx = bg.getContext("2d");
    if (!ctx) return;
    const W = bg.clientWidth;
    const H = bg.clientHeight;

    ctx.clearRect(0, 0, W, H);

    // background faint dots/grid to echo design - very subtle
    ctx.save();
    ctx.globalAlpha = 0.02;
    ctx.fillStyle = "#000";
    // nothing heavy here (kept empty so CSS grid covers visual)
    ctx.restore();

    // update + render agents
    const agents = agentsRef.current;
    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];
      // movement (pixels per second scaled by dt)
      const step = (a.speed * dt) / 1000;
      a.x += step * a.dir;

      // wrap-around horizontally
      const margin = 120;
      if (a.dir === 1 && a.x - margin > W) {
        a.x = -margin;
        a.y = Math.random() * H;
      } else if (a.dir === -1 && a.x + margin < 0) {
        a.x = W + margin;
        a.y = Math.random() * H;
      }

      // slight vertical bob based on time
      const bob = Math.sin((ts / 1000) * (0.3 + (i % 5) * 0.05)) * 6;
      const alpha = 0.6 - (a.scale - 0.5) * 0.2;
      ctx.globalAlpha = Math.max(0.25, Math.min(0.95, alpha));
      // signature color: black-ish on light canvas; white-ish overlay if you use dark bg
      drawSignature(ctx, signatures[a.sigIndex] ?? [[[{ x: 0, y: 0 }]]], a.x, a.y + bob, a.scale * 0.9, a.angle, "rgba(255,255,255,0.95)");
    }

    // occasionally spawn extra agents so it's never empty (keeps endless feel)
    if (agents.length < INITIAL_AGENTS) repopulateAgents();

    rafRef.current = requestAnimationFrame(animate);
  };

  // mount: set canvas size, start animation
  useEffect(() => {
    const onResize = () => {
      resizeCanvas(bgRef.current);
      resizeCanvas(drawRef.current);
      repopulateAgents();
    };
    onResize();
    window.addEventListener("resize", onResize);
    repopulateAgents();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repopulateAgents]); // repopulate when signatures change

  // save signatures to storage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(signatures));
      repopulateAgents();
    } catch {
      // ignore storage errors
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatures]);

  // ---------- Drawing (input canvas) handlers ----------
  useEffect(() => {
    const canvas = drawRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      resizeCanvas(canvas);
      // clear visual area
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // pointer helpers for normalized coordinates inside draw canvas
  const clientToCanvas = (e: React.PointerEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  // start drawing
  const startDraw = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawRef.current;
    if (!canvas) return;
    (ev.target as Element).setPointerCapture(ev.pointerId);
    drawing.current = true;
    const pt = clientToCanvas(ev, canvas);
    strokesRef.current.push([{ x: pt.x, y: pt.y, t: Date.now() }]);
  };

  const moveDraw = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const canvas = drawRef.current;
    if (!canvas) return;
    const pt = clientToCanvas(ev, canvas);
    const curStroke = strokesRef.current[strokesRef.current.length - 1];
    if (!curStroke) return;
    curStroke.push({ x: pt.x, y: pt.y, t: Date.now() });
    redrawLiveStroke();
  };

  const endDraw = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = false;
    try {
      (ev.target as Element).releasePointerCapture(ev.pointerId);
    } catch {
      // ignore errors
    }
  };

  // redraw live strokes on draw canvas
  const redrawLiveStroke = () => {
    const canvas = drawRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    ctx.lineCap = "round";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    for (const stroke of strokesRef.current) {
      if (stroke.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
  };

  // clear the drawing pad
  const clearPad = () => {
    strokesRef.current = [];
    const c = drawRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
  };

  // submit signature (push to signatures state). Normalize strokes to bounding box origin
  const submitSignature = () => {
    const sig = strokesRef.current;
    if (!sig || sig.length === 0) return;
    // normalize points so origin (0,0) is top-left of signature bounds
    let minX = Infinity,
      minY = Infinity;
    for (const stroke of sig) {
      for (const p of stroke) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
      }
    }
    const normalized: Signature = sig.map((stroke) => stroke.map((p) => ({ x: p.x - minX, y: p.y - minY, t: p.t })));
    setSignatures((s) => {
      const next = [...s, normalized];
      return next;
    });
    clearPad();
    // spawn new agent representing this signature
    const bg = bgRef.current;
    if (!bg) return;
    const W = bg.clientWidth;
    const H = bg.clientHeight;
    const idx = signatures.length; // since state update is async, this refers to previous length; it's fine
    const b = signatureBounds(normalized);
    agentsRef.current.push({
      sigIndex: idx,
      x: Math.random() > 0.5 ? -120 : W + 120,
      y: Math.random() * H,
      speed: 20 + Math.random() * 50,
      scale: Math.max(0.6, Math.min(1.4, 120 / Math.max(b.w, b.h))),
      angle: Math.random() * 30 - 15,
      width: b.w,
      height: b.h,
      dir: Math.random() > 0.5 ? 1 : -1,
    });
  };

  // quick UI: clear all saved signatures
  const clearAll = () => {
    setSignatures([]);
    localStorage.removeItem(STORAGE_KEY);
    agentsRef.current = [];
  };

  return (
    <section className="relative w-full min-h-[420px] bg-black text-white overflow-hidden rounded-lg">
      {/* Animated background canvas */}
      <canvas ref={bgRef} className="absolute inset-0 w-full h-full" style={{ display: "block" }} />

      {/* overlay content */}
      <div className="relative z-10 p-8 flex flex-col items-center">
        <h3 className="text-2xl font-semibold mb-2">Visitors’ Book</h3>
        <p className="text-sm text-gray-400 mb-6 max-w-2xl text-center">
          Leave a mark. Your signature will join the stream and float across the page for everyone to see.
        </p>

        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2 bg-white/3 border border-white/10 rounded-lg p-4">
            <div className="text-sm text-gray-200 mb-2">Live stream (background) — continuously running</div>
            <div className="text-xs text-gray-400">Tip: scroll the page to see different clusters</div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() =>
                  window.open("/visitors-book-gallery", "_blank") // placeholder if you want a gallery link
                }
                className="px-3 py-2 bg-white text-black rounded-md text-sm"
              >
                View Book
              </button>

              <button
                onClick={clearAll}
                className="px-3 py-2 border border-white/20 rounded-md text-sm"
                title="Clear all saved signatures"
              >
                Clear All
              </button>
              <div className="ml-auto text-xs text-gray-400 self-center">
                Saved: {signatures.length}
              </div>
            </div>
          </div>

          {/* Draw pad */}
          <div className="bg-white/3 border border-white/10 rounded-lg p-3 flex flex-col items-center">
            <div className="text-sm text-gray-200 mb-2">Sign here</div>
            <div className="w-[260px] h-[120px] bg-transparent border border-white/10 rounded-md overflow-hidden relative">
              <canvas
                ref={drawRef}
                className="w-full h-full touch-none"
                onPointerDown={startDraw}
                onPointerMove={moveDraw}
                onPointerUp={endDraw}
                onPointerCancel={endDraw}
                // ensure pointers are captured
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>

            <div className="mt-3 w-full flex gap-2">
              <button
                onClick={clearPad}
                className="flex-1 px-3 py-2 border border-white/20 rounded-md text-sm"
                title="Clear pad"
              >
                Clear
              </button>
              <button
                onClick={submitSignature}
                className="flex-1 px-3 py-2 bg-white text-black rounded-md text-sm"
                title="Save signature"
              >
                Submit
              </button>
            </div>
            <div className="text-[10px] text-gray-400 mt-2">works on touch + mouse</div>
          </div>
        </div>
      </div>

      {/* small footer hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-gray-500 select-none">
        The stream runs forever. Reload-safe.
      </div>
    </section>
  );
}
