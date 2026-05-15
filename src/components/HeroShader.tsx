import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 1800;

const bgVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const bgFragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz;
    x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m;m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0;
    vec3 h=abs(x)-0.5;
    vec3 ox=floor(x+0.5);
    vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
  float fbm(vec2 p){
    float v=0.0; float a=0.5;
    for(int i=0;i<3;i++){ v+=a*snoise(p); p*=2.0; a*=0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    vec2 m = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    float t = uTime * 0.07;
    float n = fbm(p * 1.6 + vec2(t, -t * 0.7));
    float n2 = fbm(p * 0.8 - vec2(t * 0.5, t * 0.3));

    float dist = length(p - m * 0.6);
    float halo = smoothstep(0.7, 0.0, dist) * 0.5;

    vec3 ink = vec3(0.04);
    vec3 acid = vec3(0.776, 1.0, 0.239);
    vec3 plasma = vec3(1.0, 0.239, 0.498);

    vec3 col = mix(ink, acid * 0.22, smoothstep(0.4, 0.85, n) * 0.25);
    col = mix(col, plasma * 0.18, smoothstep(0.55, 0.9, n2) * halo * 0.7);
    col += halo * acid * 0.08;

    float vig = smoothstep(1.4, 0.15, length(p));
    col *= vig * 0.85;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderBackground() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useFrame(({ clock, size, pointer }) => {
    if (!matRef.current) return;
    target.current.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
    mouse.current.lerp(target.current, 0.05);
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uMouse.value.copy(mouse.current);
    uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[60, 30]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={bgVertex}
        fragmentShader={bgFragment}
        depthWrite={false}
      />
    </mesh>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef(new THREE.Vector2());
  const target = useRef(new THREE.Vector2());

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = Math.pow(Math.random(), 0.55) * 4.6;
      const a = Math.random() * Math.PI * 2;
      const b = (Math.random() - 0.5) * 1.4;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = b;
      positions[i * 3 + 2] = Math.sin(a) * r;
      seeds[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const u = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };
    return { geometry: g, uniforms: u };
  }, []);

  useFrame(({ clock, pointer }) => {
    target.current.set(pointer.x, pointer.y);
    mouse.current.lerp(target.current, 0.05);
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uMouse.value.copy(mouse.current);
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.04 + mouse.current.x * 0.25;
      ref.current.rotation.x = mouse.current.y * -0.18;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          attribute float aSeed;
          uniform float uTime;
          uniform vec2 uMouse;
          varying float vAlpha;
          varying float vSeed;

          void main() {
            vSeed = aSeed;
            vec3 pos = position;
            float t = uTime * (0.25 + aSeed * 0.5);
            pos.y += sin(t + aSeed * 6.28) * 0.22;
            pos.x += cos(t * 0.7 + aSeed * 3.14) * 0.13;

            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            float dist = length(mv.xyz);
            vAlpha = smoothstep(7.0, 2.0, dist);

            gl_Position = projectionMatrix * mv;
            gl_PointSize = (1.4 + aSeed * 1.8) * (280.0 / -mv.z);
          }
        `}
        fragmentShader={/* glsl */ `
          precision mediump float;
          varying float vAlpha;
          varying float vSeed;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;
            float core = smoothstep(0.5, 0.0, d);
            vec3 c1 = vec3(0.776, 1.0, 0.239);
            vec3 c2 = vec3(1.0, 0.239, 0.498);
            vec3 c3 = vec3(0.96, 0.94, 0.91);
            vec3 col = vSeed > 0.75 ? c1 : (vSeed > 0.5 ? c2 : c3);
            gl_FragColor = vec4(col, core * vAlpha * 0.55);
          }
        `}
      />
    </points>
  );
}

export default function HeroShader() {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      className="!absolute inset-0"
      style={{ pointerEvents: 'none' }}
      performance={{ min: 0.5 }}
    >
      <color attach="background" args={['#0a0a0a']} />
      <ShaderBackground />
      <ParticleField />
    </Canvas>
  );
}
