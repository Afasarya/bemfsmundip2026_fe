"use client";

/**
 * ArchivedMemoriesGallery
 * ─────────────────────────────────────────────────────────────────────────────
 * Three.js vanilla 3-D photo gallery (no react-three-fiber).
 *
 * DESIGN SYSTEM  →  follows Bara Momentum tokens from tailwind.config + globals.css
 *   bg-dark  : #1A0A06   (--bara-bg / bara-bg-dark)
 *   orange   : #F25C05   (bara-orange)
 *   red      : #B22408   (bara-red)
 *   maroon   : #5C1002   (bara-maroon)
 *   gold     : #F5C542   (bara-gold)
 *   font     : Playfair Display (display) / Plus Jakarta Sans (sans)
 *   glass    : rgba(15,5,2,0.55) bg + backdrop-filter blur(18px) + border rgba(255,255,255,0.06)
 *              (matches .glass-nav in globals.css)
 *
 * TWEAKABLE CONSTANTS — search "← TWEAK" to find all configurable values
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ─── TWEAK: image paths ──────────────────────────────────────────────────────
// slider_7 is .heif (not browser-native), so only slider_1-6 are used.
// Images repeat across all PHOTO_COUNT planes.
const SLIDER_PATHS: string[] = [
  "/images/slider_1.webp",
  "/images/slider_2.jpg",
  "/images/slider_3.jpg",
  "/images/slider_4.jpg",
  "/images/slider_5.jpg",
  "/images/slider_6.jpg",
];

// ─── TWEAK: scene geometry ───────────────────────────────────────────────────
const PHOTO_COUNT = 48;     // ← TWEAK total polaroid planes in the scene
const X_SPREAD    = 12;     // ← TWEAK random x: -X_SPREAD .. +X_SPREAD
const Y_SPREAD    = 7;      // ← TWEAK random y: -Y_SPREAD .. +Y_SPREAD
const Z_NEAR      = 8;      // ← TWEAK closest z a photo can start at
const Z_FAR       = -50;    // ← TWEAK furthest z a photo can start at

// ── Frame dimensions (16:9) ──────────────────────────────────────────────────
// Geometry:  BORDER around all sides, BOT_BAR is the thick polaroid bottom strip.
// Image area is exactly 16:9 and fills the frame inset.
const FRAME_BORDER = 0.11;  // uniform gap on LEFT, RIGHT, TOP (world units)
const FRAME_BOT    = 0.30;  // wider white bar at BOTTOM (polaroid signature)
const IMG_W        = 2.2;   // ← TWEAK image display width (world units)
const IMG_H        = IMG_W * (9 / 16); // exact 16:9 height  ≈ 1.2375
const PLANE_W      = IMG_W + FRAME_BORDER * 2;    // total frame width  ≈ 2.42
const PLANE_H      = IMG_H + FRAME_BORDER + FRAME_BOT; // total frame height ≈ 1.65
// Image y-offset from frame centre so border is even on top and bottom-bar fills bottom
const IMG_Y_OFF    = (FRAME_BOT - FRAME_BORDER) / 2; // shift image UP from centre

// ─── TWEAK: idle drift ──────────────────────────────────────────────────────
// All photos drift LEFT uniformly — speed is consistent so the motion looks
// like a single slow horizontal conveyor belt.
const DRIFT_SPEED    = 0.004; // ← TWEAK uniform leftward drift (world units/frame)
const DRIFT_WRAP     = X_SPREAD + 2; // wrap-around boundary
const BOB_AMP        = 0.008; // ← near-zero bobbing — keeps motion clean & horizontal
const BOB_SPEED_MIN  = 0.2;   // ← slow bobbing angular speed min
const BOB_SPEED_MAX  = 0.4;   // ← slow bobbing angular speed max

// ─── TWEAK: drag rotation ────────────────────────────────────────────────────
const DRAG_SENSITIVITY = 0.006; // ← TWEAK pixels → radians
const PITCH_CLAMP      = 0.4;   // ← TWEAK max pitch ± radians
const ROT_LERP         = 0.07;  // ← TWEAK rotation smoothing (0=never, 1=instant)

// ─── TWEAK: scroll camera ────────────────────────────────────────────────────
const SCROLL_SPEED = 0.018;  // ← TWEAK wheel delta → camera z movement
const CAM_Z_MIN    = -30;    // ← TWEAK furthest camera can go into scene
const CAM_Z_MAX    = 18;     // ← TWEAK closest (behind gallery start)
const CAM_LERP     = 0.06;   // ← TWEAK camera z smoothing
const CAM_Z_START  = 14;     // ← TWEAK initial camera z position

// ─── TWEAK: opacity fade by depth ───────────────────────────────────────────
const FADE_NEAR_DIST = 2;   // ← TWEAK photos within this dist in front of cam → fade out
const FADE_FAR_DIST  = 28;  // ← TWEAK photos beyond this dist behind cam → fade in

// ─── TWEAK: fire particles ──────────────────────────────────────────────────
// Particles rise from the bottom like embers off a fire — kept intentionally
// sparse so photos remain the hero.
// BUG FIX: camera sits at Z=14. Particles must be at Z < 14 to be in front
// of the camera. We pin them to a narrow band: 2 … 11 (clearly visible).
const SPARK_COUNT  = 28;   // ← tiny bright hot sparks
const EMBER_COUNT  = 22;   // ← mid-size glowing embers
const ASH_COUNT    = 12;   // ← soft ash wisps
const EMBER_RISE_SPEED = 0.018; // ← upward drift per frame
const EMBER_SWAY_AMP   = 0.005; // ← horizontal sway amplitude per frame
const EMBER_Y_SPAWN    = -6;    // ← y where particles spawn (bottom)
const EMBER_Y_TOP      =  8;    // ← y where particles wrap back to bottom
const EMBER_X_SPREAD   = 10;    // ← horizontal spread
const EMBER_Z_MIN      =  2;    // ← closest z to camera (camera at 14, looking -z)
const EMBER_Z_MAX      = 11;    // ← furthest z — still clearly in front of cam

// ─────────────────────────────────────────────────────────────────────────────

interface PhotoMeta {
  wrapper: THREE.Object3D;
  // All photos drift left at the same base speed.
  // depthFactor is applied per-frame (closer = slightly faster, natural parallax)
  bobOffset: number;   // phase offset for sin wave
  bobSpeed: number;
  baseY: number;
}

interface EmberMeta {
  riseSpeed: number;   // upward drift speed per frame
  swayPhase: number;   // horizontal sway phase offset
  swaySpeed: number;   // horizontal sway angular speed
  flickerPhase: number; // random phase offset for sin flicker
  flickerSpeed: number; // angular frequency of flicker
  baseOpacity: number;  // base opacity (0.3–0.85)
  yMin: number;         // wrap bottom (respawn point)
  yMax: number;         // wrap top
}

export default function ArchivedMemoriesGallery() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const fireRef     = useRef<HTMLCanvasElement>(null); // 2-D fire particle overlay

  // Drives header + hint opacity (0 = top, 1 = fully scrolled in)
  const [scrollProgress, setScrollProgress] = useState(0);

  // ── 2-D Fire particle overlay (guaranteed visible, independent of Three.js) ──
  useEffect(() => {
    const cv = fireRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    // Resize canvas to match its CSS size
    const resize = () => {
      cv.width  = cv.clientWidth  * Math.min(window.devicePixelRatio, 2);
      cv.height = cv.clientHeight * Math.min(window.devicePixelRatio, 2);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    // Particle definition
    interface FP {
      x: number; y: number;   // position (0‥1 normalised)
      r: number;              // radius (normalised)
      life: number;           // 0 = just spawned, 1 = dead
      speed: number;          // rise speed
      phase: number;          // sway phase
      sway: number;           // sway amplitude
      hue: number;            // 15-45 (gold-orange-red)
      alpha: number;          // max alpha
    }

    // Build initial pool — sparse by design
    const COUNT = 38;
    const particles: FP[] = [];

    function spawnParticle(life = Math.random()): FP {
      return {
        x:     Math.random(),
        y:     1 - life * 0.6,               // start near bottom
        r:     0.003 + Math.random() * 0.007, // tiny
        life,
        speed: 0.0008 + Math.random() * 0.0016,
        phase: Math.random() * Math.PI * 2,
        sway:  0.0002 + Math.random() * 0.0005,
        hue:   15 + Math.random() * 35,   // gold → orange → red
        alpha: 0.55 + Math.random() * 0.40,
      };
    }

    for (let i = 0; i < COUNT; i++) particles.push(spawnParticle());

    let rafId: number;
    let t = 0;

    function draw() {
      rafId = requestAnimationFrame(draw);
      t += 0.016; // ~60 fps

      const W = cv.width;
      const H = cv.height;

      // Clear with full transparency
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        // Rise upward + horizontal sway
        p.y    -= p.speed;
        p.x    += Math.sin(t * 1.2 + p.phase) * p.sway;
        p.life += p.speed * 0.7;

        // Respawn when it exits the top or fully aged
        if (p.life >= 1 || p.y < -0.05) {
          Object.assign(p, spawnParticle(0));
          continue;
        }

        // Fade out near top, fade in near bottom
        const fadeIn  = Math.min(1, p.life * 8);
        const fadeOut = 1 - Math.pow(p.life, 2);
        const alpha   = p.alpha * fadeIn * fadeOut;
        if (alpha < 0.01) continue;

        const px = p.x * W;
        const py = p.y * H;
        const pr = p.r * Math.min(W, H);

        // Glow: outer diffuse
        const outer = ctx.createRadialGradient(px, py, 0, px, py, pr * 3.5);
        outer.addColorStop(0,   `hsla(${p.hue}, 100%, 70%, ${alpha * 0.5})`);
        outer.addColorStop(0.4, `hsla(${p.hue}, 100%, 55%, ${alpha * 0.2})`);
        outer.addColorStop(1,   `hsla(${p.hue}, 100%, 40%, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, pr * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = outer;
        ctx.fill();

        // Core: bright hot centre
        const core = ctx.createRadialGradient(px, py, 0, px, py, pr);
        core.addColorStop(0,   `hsla(${p.hue + 30}, 100%, 95%, ${alpha})`);
        core.addColorStop(0.5, `hsla(${p.hue},      100%, 70%, ${alpha * 0.8})`);
        core.addColorStop(1,   `hsla(${p.hue - 10}, 100%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
      }
    }

    draw();
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Scene + Camera ────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      120,
    );
    camera.position.set(0, 0, CAM_Z_START);

    // ── Ambient light (makes textures visible without complex shading) ────
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));

    // ── Root group — drag rotation is applied here ─────────────────────
    const group = new THREE.Group();
    scene.add(group);

    // ── Ember / ash particle system ─────────────────────────────────────────
    // Brand palette: Primary #C0380F · Secondary #E8581A · Tertiary #F4A130 · Neutral #88726D
    //
    // Three tiers keep photos as the HERO:
    //   SPARKS  — tiny bright hot embers, fast flicker
    //   EMBERS  — medium glowing orbs, medium rise
    //   ASH     — large soft translucent clouds, very slow drift

    // ── Sprite: soft radial glow encoded in ALPHA channel ──────────────────
    // CRITICAL: radial gradient fills alpha 1→0 from center to edge.
    // PointsMaterial reads the alpha channel via `map`, making circular particles.
    function makeGlowSprite(innerStop = 0.15): THREE.Texture {
      const S = 128;
      const cv = document.createElement("canvas");
      cv.width = S; cv.height = S;
      const ctx = cv.getContext("2d")!;
      // Clear to fully transparent first
      ctx.clearRect(0, 0, S, S);
      const half = S / 2;
      const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0,         `rgba(255,255,255,1.0)`);
      grad.addColorStop(innerStop, `rgba(255,255,255,0.85)`);
      grad.addColorStop(0.5,       `rgba(255,255,255,0.25)`);
      grad.addColorStop(1.0,       `rgba(255,255,255,0.00)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, S, S);
      const tex = new THREE.CanvasTexture(cv);
      tex.needsUpdate = true;
      return tex;
    }

    const spriteTight  = makeGlowSprite(0.10); // sharper core — for sparks
    const spriteLoose  = makeGlowSprite(0.35); // diffuse bloom — for ash

    // ── Shared weighted-color picker ────────────────────────────────────────
    // Bright tiers lean yellow-orange; darker tiers use more red/neutral
    function pickColor(palette: number[], weights: number[]): number {
      const r = Math.random();
      let acc = 0;
      for (let i = 0; i < palette.length; i++) {
        acc += weights[i];
        if (r < acc) return palette[i];
      }
      return palette[0];
    }

    const SPARK_PALETTE  = [0xF4A130, 0xF4A130, 0xE8581A]; // hot yellow-orange
    const SPARK_WEIGHTS  = [0.55, 0.30, 0.15];
    const EMBER_PALETTE  = [0xF4A130, 0xE8581A, 0xC0380F];
    const EMBER_WEIGHTS  = [0.35, 0.40, 0.25];
    const ASH_PALETTE    = [0xE8581A, 0xC0380F, 0x88726D];
    const ASH_WEIGHTS    = [0.30, 0.40, 0.30];

    const emberMetas: EmberMeta[] = [];

    // ── Helper: build a typed particle layer ────────────────────────────────
    // Particles spawn at a random y between EMBER_Y_SPAWN and EMBER_Y_TOP,
    // concentrated near the bottom so they appear to rise from a fire below.
    function buildLayer(
      count: number,
      size: number,
      sprite: THREE.Texture,
      opacity: number,
      palette: number[],
      weights: number[],
    ): {
      points: THREE.Points;
      posArr: Float32Array;
      colArr: Float32Array;
      colDyn: Float32Array;
      posAttr: THREE.BufferAttribute;
      colAttr: THREE.BufferAttribute;
      metaStart: number; // index into shared emberMetas
    } {
      const posArr = new Float32Array(count * 3);
      const colArr = new Float32Array(count * 3);
      const metaStart = emberMetas.length;
      const yRange = EMBER_Y_TOP - EMBER_Y_SPAWN;

      for (let i = 0; i < count; i++) {
        // Spread x across visible area; bias y toward bottom (fire source)
        posArr[i * 3 + 0] = (Math.random() - 0.5) * EMBER_X_SPREAD;
        // Bias spawn toward lower portion — square root gives bottom-heavy distribution
        posArr[i * 3 + 1] = EMBER_Y_SPAWN + Math.pow(Math.random(), 1.5) * yRange;
        // FIX: place particles clearly in front of camera (cam at Z=14, looking -Z)
        // Z between EMBER_Z_MIN and EMBER_Z_MAX — always visible
        posArr[i * 3 + 2] = EMBER_Z_MIN + Math.random() * (EMBER_Z_MAX - EMBER_Z_MIN);

        const hex = pickColor(palette, weights);
        colArr[i * 3 + 0] = ((hex >> 16) & 0xff) / 255;
        colArr[i * 3 + 1] = ((hex >>  8) & 0xff) / 255;
        colArr[i * 3 + 2] = ( hex        & 0xff) / 255;

        emberMetas.push({
          riseSpeed:    EMBER_RISE_SPEED * (0.4 + Math.random() * 0.6),
          swayPhase:    Math.random() * Math.PI * 2,
          swaySpeed:    0.3 + Math.random() * 0.8,
          flickerPhase: Math.random() * Math.PI * 2,
          flickerSpeed: 1.0 + Math.random() * 3.0,
          baseOpacity:  0.40 + Math.random() * 0.45,
          yMin: EMBER_Y_SPAWN,
          yMax: EMBER_Y_TOP,
        });
      }

      const geo      = new THREE.BufferGeometry();
      const posAttr  = new THREE.BufferAttribute(posArr, 3);
      const colAttr  = new THREE.BufferAttribute(colArr, 3);
      posAttr.setUsage(THREE.DynamicDrawUsage);
      colAttr.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute("position", posAttr);
      geo.setAttribute("color",    colAttr);

      const mat = new THREE.PointsMaterial({
        map:             sprite,
        size,
        sizeAttenuation: true,
        transparent:     true,
        opacity,
        alphaTest:       0.01,  // discard near-zero alpha → crisp soft edge, no squares
        blending:        THREE.AdditiveBlending,
        depthWrite:      false,
        vertexColors:    true,
      });

      const points = new THREE.Points(geo, mat);
      return {
        points,
        posArr,
        colArr,
        colDyn: new Float32Array(colArr), // working copy for per-frame flicker
        posAttr,
        colAttr,
        metaStart,
      };
    }

    // ── Create the three tiers ───────────────────────────────────────────────
    // Larger sizes + higher opacity so they're clearly visible on the dark bg.
    const sparks = buildLayer(SPARK_COUNT, 0.15, spriteTight, 0.85, SPARK_PALETTE, SPARK_WEIGHTS);
    const embers = buildLayer(EMBER_COUNT, 0.35, spriteTight, 0.70, EMBER_PALETTE, EMBER_WEIGHTS);
    const ash    = buildLayer(ASH_COUNT,   0.80, spriteLoose, 0.40, ASH_PALETTE,   ASH_WEIGHTS);

    scene.add(sparks.points);
    scene.add(embers.points);
    scene.add(ash.points);

    // ── Texture loader ────────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    const textures = SLIDER_PATHS.map((path) => {
      const tex = loader.load(path);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });

    // ── Polaroid plane factory ─────────────────────────────────────────────
    /**
     * Each polaroid is an Object3D with two child Meshes:
     *   1. White frame  (full PLANE_W × PLANE_H, cream-white colour)
     *   2. Photo plane  (inset image texture, slightly in front of frame)
     * Random tilt and base position are stored once; drift updates them each frame.
     */
    const photos: PhotoMeta[] = [];
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    for (let i = 0; i < PHOTO_COUNT; i++) {
      const wrapper = new THREE.Object3D();

      // Random 3-D scatter position
      wrapper.position.set(
        rand(-X_SPREAD, X_SPREAD),
        rand(-Y_SPREAD, Y_SPREAD),
        rand(Z_FAR, Z_NEAR),
      );

      // No tilt — frames are perfectly straight (polaroid flat look)
      wrapper.rotation.z = 0;

      // ── White polaroid frame (cream-white, #FDF8F4) ──
      const frameGeo = new THREE.PlaneGeometry(PLANE_W, PLANE_H);
      const frameMat = new THREE.MeshBasicMaterial({
        color: 0xfdf8f4,
        transparent: true,
        opacity: 1,
      });
      wrapper.add(new THREE.Mesh(frameGeo, frameMat));

      // ── Photo plane — exactly 16:9, inset FRAME_BORDER on sides/top ──
      // IMG_Y_OFF shifts the image up so the wider white bar sits at the bottom.
      const imgGeo = new THREE.PlaneGeometry(IMG_W, IMG_H);
      const imgMat = new THREE.MeshBasicMaterial({
        map: textures[i % textures.length],
        transparent: true,
        opacity: 1,
      });
      const imgMesh = new THREE.Mesh(imgGeo, imgMat);
      imgMesh.position.set(0, IMG_Y_OFF, 0.001);
      wrapper.add(imgMesh);

      group.add(wrapper);

      photos.push({
        wrapper,
        // All photos drift LEFT (driftDir removed — always -1 via DRIFT_SPEED)
        bobOffset:  rand(0, Math.PI * 2),
        bobSpeed:   rand(BOB_SPEED_MIN, BOB_SPEED_MAX),
        baseY:      wrapper.position.y,
      });
    }

    // ── Drag state ────────────────────────────────────────────────────────
    let isDragging   = false;
    let prevX        = 0;
    let prevY        = 0;
    let targetYaw    = 0;
    let targetPitch  = 0;
    let currentYaw   = 0;
    let currentPitch = 0;

    // ── Camera scroll state ───────────────────────────────────────────────
    let targetCamZ  = CAM_Z_START;
    let currentCamZ = CAM_Z_START;

    // ── Clock (for bobbing / elapsed time) ───────────────────────────────
    const clock = new THREE.Clock();

    // ── Animation loop ────────────────────────────────────────────────────
    let rafId: number;

    function animate() {
      rafId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Smooth drag rotation with lerp
      currentYaw   += (targetYaw   - currentYaw)   * ROT_LERP;
      currentPitch += (targetPitch - currentPitch)  * ROT_LERP;
      group.rotation.y = currentYaw;
      group.rotation.x = currentPitch;

      // Smooth camera Z with lerp (scroll)
      currentCamZ += (targetCamZ - currentCamZ) * CAM_LERP;
      camera.position.z = currentCamZ;

      // ── Fire particle animation (3 tiers) ────────────────────────────────
      // Each particle rises upward with gentle horizontal sway, wrapping back
      // to the bottom spawn zone when it exits the top.
      function animateLayer(
        layer: ReturnType<typeof buildLayer>,
        count: number,
      ) {
        for (let i = 0; i < count; i++) {
          const mi = layer.metaStart + i;
          const m  = emberMetas[mi];

          // Rise upward
          layer.posArr[i * 3 + 1] += m.riseSpeed;

          // Natural horizontal sway (sin wave)
          layer.posArr[i * 3 + 0] +=
            Math.sin(elapsed * m.swaySpeed + m.swayPhase) * EMBER_SWAY_AMP;

          // Wrap: when particle reaches the top, respawn at the bottom
          if (layer.posArr[i * 3 + 1] > m.yMax) {
            layer.posArr[i * 3 + 1] = m.yMin;
            // Re-randomise x on respawn for natural variety
            layer.posArr[i * 3 + 0] = (Math.random() - 0.5) * EMBER_X_SPREAD;
            // Re-randomise z slightly so depth varies over time
            layer.posArr[i * 3 + 2] = EMBER_Z_MIN + Math.random() * (EMBER_Z_MAX - EMBER_Z_MIN);
          }

          // Flicker: modulate brightness — keep floor at 0.6 so particles stay bright
          const flicker = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(elapsed * m.flickerSpeed + m.flickerPhase));
          const f = Math.max(0.5, Math.min(1.0, flicker));
          layer.colDyn[i * 3 + 0] = layer.colArr[i * 3 + 0] * f;
          layer.colDyn[i * 3 + 1] = layer.colArr[i * 3 + 1] * f;
          layer.colDyn[i * 3 + 2] = layer.colArr[i * 3 + 2] * f;
        }
        layer.posAttr.array.set(layer.posArr);
        layer.posAttr.needsUpdate = true;
        layer.colAttr.array.set(layer.colDyn);
        layer.colAttr.needsUpdate = true;
      }
      animateLayer(sparks, SPARK_COUNT);
      animateLayer(embers, EMBER_COUNT);
      animateLayer(ash,    ASH_COUNT);

      // Per-photo updates
      photos.forEach((p) => {
        const { wrapper } = p;

        // ── Depth-based parallax drift speed ──
        // depthFactor: 0 at Z_FAR (furthest), 1 at Z_NEAR (closest)
        // All photos move LEFT uniformly; closer ones move slightly faster (parallax)
        const depthFactor = (wrapper.position.z - Z_FAR) / (Z_NEAR - Z_FAR);
        const speed = DRIFT_SPEED * (0.5 + 0.5 * depthFactor);

        // Horizontal drift — always leftward (-x direction)
        wrapper.position.x -= speed;

        // Wrap around: when a photo exits left edge, teleport to right edge
        if (wrapper.position.x < -DRIFT_WRAP) wrapper.position.x = DRIFT_WRAP;

        // Very subtle vertical bobbing (keeps motion primarily horizontal)
        wrapper.position.y =
          p.baseY + Math.sin(elapsed * p.bobSpeed + p.bobOffset) * BOB_AMP;

        // ── Per-photo opacity based on distance from camera ──
        // dist > 0  → photo is behind camera (negative z relative to cam)
        // dist < 0  → photo is in front (camera already passed it)
        const dist = currentCamZ - wrapper.position.z;
        let opacity: number;

        if (dist < 0) {
          // Photo is in front of camera — fade out as it approaches/passes
          opacity = Math.max(0, 1 + dist / FADE_NEAR_DIST);
        } else if (dist > FADE_FAR_DIST) {
          // Photo is very far away — fade in (avoid sudden pop-in)
          opacity = Math.max(0, 1 - (dist - FADE_FAR_DIST) / 10);
        } else {
          opacity = 1;
        }
        opacity = Math.min(1, Math.max(0, opacity));

        // Apply opacity to both frame + image meshes
        wrapper.children.forEach((child) => {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) mat.opacity = opacity;
        });
      });

      renderer.render(scene, camera);
    }

    animate();

    // ── Pointer / drag event handlers ────────────────────────────────────
    function onPointerDown(e: PointerEvent) {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      targetYaw   += dx * DRAG_SENSITIVITY;
      // Clamp pitch to prevent over-rotation vertically
      targetPitch  = Math.max(
        -PITCH_CLAMP,
        Math.min(PITCH_CLAMP, targetPitch + dy * DRAG_SENSITIVITY),
      );
    }

    function onPointerUp(_e: PointerEvent) {
      isDragging = false;
    }

    // ── Touch event handlers (mobile = same drag behaviour as desktop) ────
    // Pointer events already handle touch on most browsers, but we add explicit
    // touch handlers as a fallback so mobile feels identical to desktop.
    let touchId: number | null = null;

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 1) {
        touchId = e.touches[0].identifier;
        isDragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
        e.preventDefault(); // block page scroll while dragging gallery
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (!isDragging || touchId === null) return;
      // Find our tracked touch
      let touch: Touch | null = null;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          touch = e.changedTouches[i];
          break;
        }
      }
      if (!touch) return;
      e.preventDefault();
      const dx = touch.clientX - prevX;
      const dy = touch.clientY - prevY;
      prevX = touch.clientX;
      prevY = touch.clientY;

      targetYaw   += dx * DRAG_SENSITIVITY;
      targetPitch  = Math.max(
        -PITCH_CLAMP,
        Math.min(PITCH_CLAMP, targetPitch + dy * DRAG_SENSITIVITY),
      );
    }

    function onTouchEnd() {
      isDragging = false;
      touchId = null;
    }

    // ── Wheel / scroll handler ────────────────────────────────────────────
    function onWheel(e: WheelEvent) {
      e.preventDefault(); // prevent page scroll while inside canvas
      targetCamZ -= e.deltaY * SCROLL_SPEED;
      targetCamZ  = Math.max(CAM_Z_MIN, Math.min(CAM_Z_MAX, targetCamZ));

      // Scroll progress: 0 at start, 1 at deepest point
      const progress = (CAM_Z_START - targetCamZ) / (CAM_Z_START - CAM_Z_MIN);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    }

    // ── Resize handler ────────────────────────────────────────────────────
    function onResize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    canvas.addEventListener("pointerdown",   onPointerDown);
    canvas.addEventListener("pointermove",   onPointerMove);
    canvas.addEventListener("pointerup",     onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel",         onWheel, { passive: false });

    // Explicit touch fallback for mobile (passive: false allows e.preventDefault)
    canvas.addEventListener("touchstart",  onTouchStart,  { passive: false });
    canvas.addEventListener("touchmove",   onTouchMove,   { passive: false });
    canvas.addEventListener("touchend",    onTouchEnd);
    canvas.addEventListener("touchcancel", onTouchEnd);

    // ── Cleanup — runs when component unmounts ─────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();

      canvas.removeEventListener("pointerdown",   onPointerDown);
      canvas.removeEventListener("pointermove",   onPointerMove);
      canvas.removeEventListener("pointerup",     onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel",         onWheel);
      canvas.removeEventListener("touchstart",    onTouchStart);
      canvas.removeEventListener("touchmove",     onTouchMove);
      canvas.removeEventListener("touchend",      onTouchEnd);
      canvas.removeEventListener("touchcancel",   onTouchEnd);

      // Dispose Three.js GPU resources
      renderer.dispose();
      // Three particle layer tiers
      [sparks, embers, ash].forEach((layer) => {
        layer.points.geometry.dispose();
        (layer.points.material as THREE.PointsMaterial).dispose();
      });
      spriteTight.dispose();
      spriteLoose.dispose();
      textures.forEach((t) => t.dispose());
      photos.forEach(({ wrapper }) => {
        wrapper.children.forEach((child) => {
          const mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.dispose();
        });
      });
    };
  }, []);

  // ── Header + hint opacity tied to scroll progress ──────────────────────
  const headerOpacity = Math.max(0, 1 - scrollProgress * 2.2);
  const hintOpacity   = Math.max(0, 1 - scrollProgress * 3);

  return (
    /**
     * Outer container — fills parent, background matches body gradient from globals.css
     * (dark base #1A0A06 + brand orange/maroon radial glows)
     */
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        background: [
          "radial-gradient(ellipse 70% 50% at 30% 20%, rgba(92,16,2,0.45) 0%, transparent 60%)",
          "radial-gradient(ellipse 60% 40% at 70% 80%, rgba(178,36,8,0.30) 0%, transparent 55%)",
          "radial-gradient(ellipse 50% 35% at 50% 50%, rgba(242,92,5,0.10) 0%, transparent 65%)",
          "linear-gradient(175deg, #1F0E08 0%, #1A0A06 40%, #110604 100%)",
        ].join(", "),
        overflow: "hidden",
      }}
    >
      {/* ── Three.js canvas ── */}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
          cursor: "grab",
          touchAction: "none",
        }}
      />

      {/* ── 2-D Fire particle overlay — always on top of Three.js, pointer-events none ── */}
      <canvas
        ref={fireRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── Header overlay (top-center) — bare text floating on scene, no card ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "clamp(2.5rem, 6vw, 5rem)",
          opacity: headerOpacity,
          transition: "opacity 0.15s ease",
        }}
      >
        <div style={{ textAlign: "center" }}>

          {/* Eyebrow label — no pill/border, just flame glyph + letter-spaced text + thin accent line */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              marginBottom: "0.9rem",
            }}
          >
            {/* Flame accent glyph */}
            <span
              className="gallery-flame"
              style={{
                fontSize: "0.8rem",
                lineHeight: 1,
                filter: "drop-shadow(0 0 4px #E8581A)",
              }}
            >
              🔥
            </span>

            {/* Thin horizontal accent line — Secondary #E8581A */}
            <span
              style={{
                display: "block",
                width: "1.6rem",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, #E8581A 40%, #F4A130 100%)",
                opacity: 0.75,
              }}
            />

            <span
              style={{
                fontSize: "0.6rem",
                textTransform: "uppercase" as const,
                letterSpacing: "0.28em",
                color: "rgba(244,161,48,0.7)",  // Tertiary #F4A130 at 70%
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
                textShadow: "0 0 12px rgba(232,88,26,0.5)",
              }}
            >
              Kenangan · BEM FSM UNDIP
            </span>

            {/* Mirrored accent line on right */}
            <span
              style={{
                display: "block",
                width: "1.6rem",
                height: "1px",
                background:
                  "linear-gradient(270deg, transparent, #E8581A 40%, #F4A130 100%)",
                opacity: 0.75,
              }}
            />
          </div>

          {/* Title — Playfair Display serif, warm glow text-shadow — no gradient clip needed */}
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              marginBottom: "0.6rem",
              color: "#F4A130",           // Tertiary as base colour
              textShadow: [
                "0 0  8px rgba(240,90,15,0.90)",   // tight inner glow — Secondary-ish
                "0 0 22px rgba(192,56,15,0.70)",   // mid bloom — Primary #C0380F
                "0 0 55px rgba(192,56,15,0.35)",   // wide halo
                "0 2px  6px rgba(0,0,0,0.80)",     // subtle drop shadow for legibility
              ].join(", "),
            }}
          >
            Archived Memories
          </h2>

          {/* Subtitle — softly glowing so it reads without a card behind it */}
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(0.78rem, 1.4vw, 0.88rem)",
              color: "rgba(255,255,255,0.55)",
              fontWeight: 300,
              lineHeight: 1.65,
              margin: 0,
              letterSpacing: "0.02em",
              textShadow: "0 0 18px rgba(192,56,15,0.45), 0 1px 4px rgba(0,0,0,0.85)",
            }}
          >
            Seret untuk menjelajah · Gulir untuk mendekat
          </p>
        </div>
      </div>

      {/* ── Bottom scroll hint ── */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(1.5rem, 4vw, 2.5rem)",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          opacity: hintOpacity,
          transition: "opacity 0.15s ease",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem" }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.625rem",
            textTransform: "uppercase" as const,
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.30)",
          }}>
            Scroll
          </span>
          {/* Mouse icon with animated dot */}
          <span style={{
            display: "block",
            width: "1.25rem",
            height: "2rem",
            borderRadius: "9999px",
            border: "1.5px solid rgba(255,255,255,0.20)",
            padding: "0.3rem 0.3rem",
            boxSizing: "border-box" as const,
          }}>
            <span className="gallery-scroll-dot" style={{
              display: "block",
              width: "100%",
              height: "0.45rem",
              borderRadius: "9999px",
              background: "#F25C05",
            }} />
          </span>
        </div>
      </div>

      {/* Subtle fire-glow radial at bottom — CSS layer, always visible */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          pointerEvents: "none",
          background: [
            "radial-gradient(ellipse 70% 80% at 50% 110%, rgba(192,56,15,0.22) 0%, transparent 65%)",
            "radial-gradient(ellipse 40% 50% at 30% 115%, rgba(242,92,5,0.14) 0%, transparent 60%)",
            "radial-gradient(ellipse 40% 50% at 70% 115%, rgba(232,88,26,0.14) 0%, transparent 60%)",
          ].join(", "),
          animation: "fireGlowPulse 3.5s ease-in-out infinite",
        }}
      />

      {/* Keyframes for scroll-dot + flame flicker + fire glow animations */}
      <style>{`
        .gallery-scroll-dot {
          animation: galleryScrollDot 1.8s ease-in-out infinite;
        }
        @keyframes galleryScrollDot {
          0%, 100% { opacity: 0.6; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(0.45rem); }
        }
        .gallery-flame {
          animation: galleryFlame 2.4s ease-in-out infinite;
        }
        @keyframes galleryFlame {
          0%, 100% { transform: scaleY(1)   rotate(-2deg); opacity: 0.85; }
          40%       { transform: scaleY(1.1) rotate( 3deg); opacity: 1.00; }
          70%       { transform: scaleY(0.9) rotate(-1deg); opacity: 0.90; }
        }
        @keyframes fireGlowPulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1.0; }
        }
      `}</style>
    </div>
  );
}
