# Portfolio Website

My personal portfolio: a single-page, scroll-driven site built with React, TypeScript and Vite. It covers who I am, my skills, a home lab, how I work, my experience and selected projects, with a contact section at the end.

## Features

- Sections: Hero, About, Skills, Home Lab, Process, Experience, Projects, Contact
- Smooth scrolling (Lenis) and scroll-triggered animation (GSAP, Framer Motion)
- A WebGL hero shader and 3D elements (three.js through React Three Fiber)
- Custom cursor, magnetic text and buttons, text scramble and word-reveal effects
- Syntax-highlighted code panel (Prism)
- Downloadable resume (PDF)

## Tech stack

| Area | Choice |
|---|---|
| Framework | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 3 |
| Animation | GSAP, Framer Motion, Lenis |
| 3D | three.js, `@react-three/fiber`, `@react-three/drei` |
| Icons | lucide-react, react-icons |

## Getting started

Requires Node.js 20 or newer.

```bash
git clone https://github.com/ProudStone-576/website-portfolio.git
cd website-portfolio
npm install
npm run dev
```

Open the local URL that Vite prints (usually http://localhost:5173).

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
  App.tsx          Page composition: the order of the sections
  components/      One component per section, plus effects (cursor, loader, shader, scroll)
  assets/          Resume PDF
  index.css        Tailwind layers and custom styles
public/            Static files
```

## Deployment

It is a static site, so `npm run build` output in `dist/` can be hosted anywhere, for example Vercel or Netlify.
