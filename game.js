import * as THREE from 'three';

// ---------- seeded rng ----------
let seed = 1337;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const rr = (a, b) => a + (b - a) * rnd();

// ---------- renderer ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.xr.enabled = true;
renderer.xr.setFramebufferScaleFactor?.(0.8);
renderer.xr.setFoveation?.(1);
document.body.prepend(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1420);
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.03, 60);
camera.position.set(0, 1.6, 1.2);
scene.add(new THREE.HemisphereLight(0xfff2dd, 0x443322, 1.3));
const sun = new THREE.DirectionalLight(0xffffff, 1.2); sun.position.set(2, 4, 3); scene.add(sun);
const lampLight = new THREE.PointLight(0xffcc77, 6, 6); lampLight.position.set(-2.2, 1.7, -1.8); scene.add(lampLight);
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

// ---------- generated textures ----------
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function jagged(g, cx, cy, r, n) { g.beginPath(); for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, rr2 = r * (0.65 + 0.35 * Math.abs(Math.sin(i * 7.3)) ); g.lineTo(cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2); } g.closePath(); }
const TEX = {
  crack: canvasTex(128, 128, (g) => { g.strokeStyle = '#111'; g.lineWidth = 3; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(64, 64); let x = 64, y = 64; const a = i * 0.7; for (let s = 0; s < 6; s++) { x += Math.cos(a + Math.sin(s * 3 + i) * 0.6) * 10; y += Math.sin(a + Math.cos(s * 2 + i) * 0.6) * 10; g.lineTo(x, y); } g.stroke(); } g.fillStyle = '#222'; g.beginPath(); g.arc(64, 64, 8, 0, 7); g.fill(); }),
  sky: canvasTex(256, 256, (g, w, h) => { g.save(); jagged(g, 128, 128, 124, 22); g.clip(); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a0010'); gr.addColorStop(0.5, '#ff4a12'); gr.addColorStop(1, '#ffb300'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 16; i++) { const bx = i * 17, bh = 50 + (i * 37) % 110; g.fillStyle = '#120608'; g.fillRect(bx, h - bh, 15, bh); g.fillStyle = '#ffd36b'; for (let k = 0; k < 8; k++) if ((i * k) % 3 === 0) g.fillRect(bx + 3 + (k % 2) * 6, h - bh + 8 + k * 10, 3, 4); } g.fillStyle = '#ff7b1a'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(30 + i * 42, 150 - (i % 3) * 20, 14, 0, 7); g.fill(); } g.fillStyle = '#fff8'; g.beginPath(); g.arc(190, 60, 18, 0, 7); g.fill(); g.restore(); g.strokeStyle = '#3a2a20'; g.lineWidth = 10; jagged(g, 128, 128, 124, 22); g.stroke(); }),
  gash: canvasTex(256, 64, (g) => { const gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, '#0000'); gr.addColorStop(0.35, '#ff6a00'); gr.addColorStop(0.5, '#fff6a0'); gr.addColorStop(0.65, '#ff2a00'); gr.addColorStop(1, '#0000'); g.fillStyle = gr; g.fillRect(8, 0, 240, 64); }),
  scorch: canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, '#000e'); gr.addColorStop(0.6, '#1a0a00b0'); gr.addColorStop(1, '#0000'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }),
  hole: canvasTex(64, 64, (g) => { g.fillStyle = '#000'; g.beginPath(); g.arc(32, 32, 12, 0, 7); g.fill(); g.strokeStyle = '#555'; g.lineWidth = 2; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(32, 32); g.lineTo(32 + Math.cos(i) * 28, 32 + Math.sin(i * 1.3) * 28); g.stroke(); } }),
  splat: canvasTex(128, 128, (g) => { g.fillStyle = '#fff'; jagged(g, 64, 64, 44, 14); g.fill(); for (let i = 0; i < 10; i++) { g.beginPath(); g.arc(64 + Math.cos(i * 2.1) * 52, 64 + Math.sin(i * 2.1) * 52, 4 + (i % 4) * 2, 0, 7); g.fill(); } }),
  stamp: canvasTex(256, 128, (g) => { g.strokeStyle = '#d0102a'; g.fillStyle = '#d0102a'; g.lineWidth = 10; g.strokeRect(10, 10, 236, 108); g.font = 'bold 64px Impact, sans-serif'; g.textAlign = 'center'; g.fillText('WRECKED', 128, 88); }),
  bite: canvasTex(64, 64, (g) => { g.fillStyle = '#2b1a0c'; for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(32 + Math.cos(i) * 14, 32 + Math.sin(i * 1.7) * 14, 9, 0, 7); g.fill(); } }),
  fire: canvasTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 40, 2, 32, 36, 30); gr.addColorStop(0, '#fff7c0'); gr.addColorStop(0.4, '#ff9a10'); gr.addColorStop(1, '#ff200000'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
  puff: canvasTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 2, 32, 32, 30); gr.addColorStop(0, '#ffffffee'); gr.addColorStop(1, '#ffffff00'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }),
};

// ---------- audio ----------
let actx = null;
function audio() { if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch { actx = null; } } return actx; }
// Dumb circus-kazoo loop, synthesized in WebAudio so the clip has no asset to load: square lead with a wobbly vibrato over an oom-pah bass.
const BGM_LEAD = [67,0,67,69,67,0,64,0,67,0,67,69,71,0,67,0, 72,0,71,69,67,0,64,62,60,0,62,64,62,0,55,0];
const BGM_BASS = [43,50,43,50,41,48,41,48,43,50,43,50,38,45,38,45];
let bgmTimer = null, bgmStep = 0, bgmGain = null;
const midiHz = (m) => 440 * Math.pow(2, (m - 69) / 12);
function bgmNote(a, hz, t, dur, type, vol, wobble) {
  const o = a.createOscillator(); const g = a.createGain(); o.type = type; o.frequency.setValueAtTime(hz, t);
  if (wobble) { const l = a.createOscillator(); const lg = a.createGain(); l.frequency.value = 7; lg.gain.value = hz * 0.035; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur); }
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(bgmGain); o.start(t); o.stop(t + dur + 0.02);
}
function startBgm() {
  const a = audio(); if (!a || bgmTimer) return;
  bgmGain = a.createGain(); bgmGain.gain.value = 0.16; bgmGain.connect(a.destination);
  const stepDur = 0.16; let next = a.currentTime + 0.05;
  bgmTimer = setInterval(() => {
    while (next < a.currentTime + 0.3) {
      const lead = BGM_LEAD[bgmStep % BGM_LEAD.length]; if (lead) bgmNote(a, midiHz(lead), next, stepDur * 0.9, 'square', 0.22, true);
      if (bgmStep % 2 === 0) bgmNote(a, midiHz(BGM_BASS[(bgmStep / 2) % BGM_BASS.length]), next, stepDur * 1.6, 'triangle', 0.35, false);
      bgmStep++; next += stepDur;
    }
  }, 60);
}
function noise(dur, freq, vol = 0.4, type = 'lowpass') {
  const a = audio(); if (!a) return; const n = a.createBufferSource(); const b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate); const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2;
  n.buffer = b; const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq; const gn = a.createGain(); gn.gain.value = vol; n.connect(f).connect(gn).connect(a.destination); n.start();
}
function tone(f0, f1, dur, vol = 0.2, type = 'square') {
  const a = audio(); if (!a) return; const o = a.createOscillator(); o.type = type; const gn = a.createGain(); o.frequency.setValueAtTime(f0, a.currentTime); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), a.currentTime + dur);
  gn.gain.setValueAtTime(vol, a.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur); o.connect(gn).connect(a.destination); o.start(); o.stop(a.currentTime + dur);
}
const SFX = {
  hammer: () => { noise(0.25, 600, 0.6); tone(120, 40, 0.2, 0.3, 'sine'); },
  saw: () => { tone(90, 140, 0.15, 0.12, 'sawtooth'); noise(0.12, 3000, 0.15, 'highpass'); },
  flame: () => noise(0.3, 900, 0.25),
  gun: () => { noise(0.07, 2500, 0.4); tone(800, 200, 0.05, 0.1); },
  paint: () => { tone(300, 80, 0.2, 0.2, 'sine'); noise(0.15, 400, 0.3); },
  stamp: () => { tone(200, 60, 0.12, 0.4, 'square'); },
  flour: () => noise(0.6, 500, 0.35),
  bug: () => tone(1200, 1800, 0.25, 0.05, 'sawtooth'),
  glass: () => { noise(0.5, 6000, 0.4, 'highpass'); tone(2400, 1200, 0.3, 0.08, 'triangle'); },
  crash: () => { noise(0.6, 300, 0.7); },
  cash: () => tone(1300, 2000, 0.08, 0.06, 'triangle'),
};

// ---------- room ----------
const LABEL_VALUE = { wall: 120, floor: 90, ceiling: 80, table: 60, couch: 140, bed: 160, storage: 80, screen: 400, lamp: 70, plant: 40, 'wall art': 600, window: 300, 'door frame': 110, 'window frame': 300, door: 110, fridge: 350, chair: 50, unknown: 75 };
const LABEL_HP = { wall: 40, floor: 40, ceiling: 40, table: 6, couch: 8, bed: 9, storage: 6, screen: 3, lamp: 2, plant: 2, 'wall art': 3, window: 2, 'door frame': 6, fridge: 10, chair: 4, unknown: 5 };
const surfaces = []; // meshes that can be hit
const room = new THREE.Group(); scene.add(room);
const W = 6, D = 6, H = 2.7;
function mat(c, o = {}) { return new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, ...o }); }
function surf(mesh, label, extra = {}) { mesh.userData = { label, hp: LABEL_HP[label] ?? 5, maxhp: LABEL_HP[label] ?? 5, value: LABEL_VALUE[label] ?? 75, hits: 0, ...extra }; surfaces.push(mesh); return mesh; }
function box(w, h, d, c, x, y, z, label, parent = room) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); m.position.set(x, y, z); parent.add(m); if (label) surf(m, label); return m; }
const wallMat = mat(0xd8cbb0);
function wallPlane(w, h, pos, rotY, rotX = 0, label = 'wall', m = wallMat) { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.copy(pos); p.rotation.set(rotX, rotY, 0, 'YXZ'); room.add(p); surf(p, label); return p; }
let roomBuilt = false;
const furniture = []; // throwable groups
function buildRoom() {
  roomBuilt = true;
  const floorTex = canvasTex(256, 256, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#8a5a34' : '#7a4e2c'; g.fillRect(0, i * 32, 256, 32); g.fillStyle = '#5a3418'; g.fillRect((i * 70) % 256, i * 32, 3, 32); } });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(3, 3);
  wallPlane(W, D, new THREE.Vector3(0, 0, 0), 0, -Math.PI / 2, 'floor', mat(0xffffff, { map: floorTex }));
  wallPlane(W, D, new THREE.Vector3(0, H, 0), 0, Math.PI / 2, 'ceiling', mat(0xeeeeee));
  wallPlane(W, H, new THREE.Vector3(0, H / 2, -D / 2), 0);
  wallPlane(W, H, new THREE.Vector3(0, H / 2, D / 2), Math.PI);
  wallPlane(D, H, new THREE.Vector3(-W / 2, H / 2, 0), Math.PI / 2);
  wallPlane(D, H, new THREE.Vector3(W / 2, H / 2, 0), -Math.PI / 2);
  // couch
  const couch = new THREE.Group(); couch.position.set(0, 0, 2.2); room.add(couch);
  box(2.2, 0.45, 0.9, 0x3a5fa8, 0, 0.25, 0, 'couch', couch); box(2.2, 0.6, 0.25, 0x33539a, 0, 0.7, 0.35, 'couch', couch);
  box(0.25, 0.65, 0.9, 0x2f4e90, -1.1, 0.35, 0, 'couch', couch); box(0.25, 0.65, 0.9, 0x2f4e90, 1.1, 0.35, 0, 'couch', couch);
  // coffee table (throwable)
  makeTable(0, 0.8);
  makeChair(-1.6, 0.4); makeChair(1.6, 0.2);
  // tv + stand
  box(2, 0.5, 0.45, 0x2b2b2b, 0, 0.25, -2.75, 'storage');
  const tv = box(1.7, 0.95, 0.06, 0x111111, 0, 1.15, -2.9, 'screen');
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.86), new THREE.MeshBasicMaterial({ color: 0x2a6cff })); glow.position.set(0, 1.15, -2.865); room.add(glow); tv.userData.glow = glow; surf(glow, 'screen'); glow.userData = tv.userData;
  // bookshelf
  box(0.4, 1.8, 1.2, 0x6b4426, -2.75, 0.9, 0.6, 'storage');
  for (let i = 0; i < 4; i++) box(0.3, 0.3, 0.9, [0xc0392b, 0x2980b9, 0xf1c40f, 0x27ae60][i], -2.7, 0.35 + i * 0.42, 0.6, 'storage');
  // bed in corner
  box(1.5, 0.5, 2, 0xf0f0f0, 2.2, 0.25, 1.9, 'bed'); box(1.5, 0.25, 0.6, 0xff8fb0, 2.2, 0.6, 1.6, 'bed');
  // lamp
  box(0.08, 1.5, 0.08, 0x333333, -2.2, 0.75, -1.8, 'lamp'); const shade = box(0.5, 0.35, 0.5, 0xfff0c0, -2.2, 1.6, -1.8, 'lamp'); shade.material.emissive = new THREE.Color(0x886622);
  // plant
  box(0.35, 0.4, 0.35, 0xb5651d, 2.4, 0.2, -2.4, 'plant'); const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), mat(0x2e9e44, { flatShading: true })); leaves.position.set(2.4, 0.85, -2.4); room.add(leaves); surf(leaves, 'plant');
  // wall art
  const art = canvasTex(128, 96, (g) => { g.fillStyle = '#f5e6c8'; g.fillRect(0, 0, 128, 96); g.fillStyle = '#e84'; g.beginPath(); g.arc(40, 40, 22, 0, 7); g.fill(); g.fillStyle = '#38a'; g.fillRect(60, 30, 50, 50); g.fillStyle = '#222'; g.font = '12px serif'; g.fillText('Grandma', 34, 90); });
  const frame = box(1.1, 0.8, 0.05, 0x8b6914, 2.97, 1.6, -0.6, 'wall art'); frame.rotation.y = -Math.PI / 2;
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.65), new THREE.MeshBasicMaterial({ map: art })); pic.position.set(2.94, 1.6, -0.6); pic.rotation.y = -Math.PI / 2; room.add(pic); surf(pic, 'wall art'); pic.userData = frame.userData; frame.userData.pic = pic;
  // window (left wall)
  const wf = box(0.06, 1.1, 1.5, 0xffffff, -2.98, 1.5, -1.0, 'window frame');
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 0.95), new THREE.MeshStandardMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.45, metalness: 0.4, roughness: 0.05 }));
  glass.position.set(-2.94, 1.5, -1.0); glass.rotation.y = Math.PI / 2; room.add(glass); surf(glass, 'window'); glass.userData.frame = wf;
  // door
  const door = box(0.95, 2.05, 0.06, 0x9c6b3c, -1.5, 1.025, 2.97, 'door frame');
  // fridge
  makeFridge(-2.6, -2.6);
}
function makeTable(x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); room.add(g);
  box(1.2, 0.08, 0.7, 0x7a4a22, 0, 0.45, 0, 'table', g); for (const [a, b] of [[-0.5, -0.28], [0.5, -0.28], [-0.5, 0.28], [0.5, 0.28]]) box(0.07, 0.42, 0.07, 0x5a3412, a, 0.21, b, 'table', g);
  furniture.push({ g, label: 'table', vel: new THREE.Vector3(), flying: false, mass: 1.6 }); return g;
}
function makeChair(x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); room.add(g);
  box(0.45, 0.06, 0.45, 0xb0472a, 0, 0.45, 0, 'chair', g); box(0.45, 0.5, 0.06, 0xb0472a, 0, 0.73, -0.2, 'chair', g);
  for (const [a, b] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]]) box(0.05, 0.43, 0.05, 0x5a2a12, a, 0.215, b, 'chair', g);
  furniture.push({ g, label: 'chair', vel: new THREE.Vector3(), flying: false, mass: 1 }); return g;
}
let fridge = null;
function makeFridge(x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = Math.PI / 4; room.add(g);
  box(0.8, 1.8, 0.7, 0xe8eef2, 0, 0.9, 0, 'fridge', g);
  const doorPivot = new THREE.Group(); doorPivot.position.set(-0.4, 0, 0.36); g.add(doorPivot);
  const dm = box(0.8, 1.78, 0.06, 0xdfe7ec, 0.4, 0.9, 0.03, 'fridge', doorPivot); dm.userData.isFridgeDoor = true;
  box(0.04, 0.5, 0.05, 0x888888, 0.72, 1.1, 0.08, null, doorPivot);
  fridge = { g, doorPivot, open: 0, opened: false };
}

// ---------- decals / particles ----------
const decals = []; const MAX_DECALS = 40;
const decalMats = {};
function decalMat(key, color = 0xffffff, blend = THREE.NormalBlending) { const k = key + color + blend; if (!decalMats[k]) decalMats[k] = new THREE.MeshBasicMaterial({ map: TEX[key], transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, color, blending: blend }); return decalMats[k]; }
const planeGeo = new THREE.PlaneGeometry(1, 1);
function decal(key, point, normal, size, color, rot = rnd() * 6.28, sx = 1, blend) {
  const m = new THREE.Mesh(planeGeo, decalMat(key, color, blend)); m.position.copy(point).addScaledVector(normal, 0.004 + decals.length * 0.000004);
  m.lookAt(point.clone().add(normal)); m.rotateZ(rot); m.scale.set(size * sx, size, 1); m.renderOrder = 2; scene.add(m); decals.push(m);
  if (decals.length > MAX_DECALS) { const o = decals.shift(); scene.remove(o); }
  return m;
}
const parts = []; // {mesh, vel, life, grav, spin, kind}
const chunkGeo = new THREE.BoxGeometry(1, 1, 1);
const chunkMats = {};
const MAX_PARTS = 30;
const spriteMats = {};
function sprite(key, color, add) { const k = key + color + add; if (!spriteMats[k]) spriteMats[k] = new THREE.SpriteMaterial({ map: TEX[key], color, transparent: true, depthWrite: false, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending }); return new THREE.Sprite(spriteMats[k]); }
function particle(mesh, vel, life, grav = 9.8, extra = {}) { if (parts.length >= MAX_PARTS) { const p = parts.shift(); scene.remove(p.mesh); } scene.add(mesh); parts.push({ mesh, vel, life, max: life, grav, ...extra }); }
function chunks(point, normal, color, n, size = 0.08, speed = 3) {
  const key = String(color); if (!chunkMats[key]) chunkMats[key] = mat(color, { flatShading: true });
  for (let i = 0; i < n; i++) { const m = new THREE.Mesh(chunkGeo, chunkMats[key]); const s = size * rr(0.5, 1.4); m.scale.set(s, s * rr(0.5, 1), s); m.position.copy(point);
    const v = normal.clone().multiplyScalar(rr(1, speed)).add(new THREE.Vector3(rr(-2, 2), rr(0, 3), rr(-2, 2))); particle(m, v, rr(2, 4), 9.8, { spin: new THREE.Vector3(rr(-9, 9), rr(-9, 9), 0), bounce: true }); }
}
function sparks(point, normal, n, color = 0xffd040) {
  for (let i = 0; i < n; i++) { const s = sprite('fire', color, true); s.scale.setScalar(0.06); s.position.copy(point); particle(s, normal.clone().multiplyScalar(rr(1, 4)).add(new THREE.Vector3(rr(-3, 3), rr(-1, 3), rr(-3, 3))), rr(0.3, 0.7), 6); }
}
function puffs(point, n, color, size, spread = 1.5, life = 3) {
  for (let i = 0; i < n; i++) { const s = sprite('puff', color, false); s.scale.setScalar(size * rr(0.6, 1.3)); s.position.copy(point); particle(s, new THREE.Vector3(rr(-spread, spread), rr(-0.3, spread), rr(-spread, spread)), life * rr(0.6, 1.2), -0.15, { grow: size * 1.5, drag: 1.8 }); }
}

// ---------- game state ----------
const TOOLS = [
  { id: 'hammer', name: '1 SLEDGE', rate: 0.28 }, { id: 'saw', name: '2 CHAINSAW', rate: 0.05, hold: true }, { id: 'flame', name: '3 FLAMER', rate: 0.09, hold: true },
  { id: 'gun', name: '4 MINIGUN', rate: 0.06, hold: true }, { id: 'paint', name: '5 PAINT', rate: 0.25 }, { id: 'stamp', name: '6 STAMP', rate: 0.25 },
  { id: 'flour', name: '7 FLOUR', rate: 0.5 }, { id: 'bugs', name: '8 CRITTERS', rate: 0.6 }, { id: 'grab', name: '9 THROW', rate: 0.4 },
];
const CRITTERS = ['fire ants', 'wasp swarm', 'camel crickets', 'horsehair worms'];
let critterIdx = 0;
let tool = TOOLS[0];
let screen = 'title', timeLeft = 90, money = 0, combo = 1, comboT = 0, lastHit = -9, attract = false, idleT = 0;
const ledger = {};
const toolEl = document.getElementById('tools');
TOOLS.forEach((t, i) => { const b = document.createElement('button'); b.textContent = t.name; b.onpointerdown = (e) => { e.stopPropagation(); setTool(i); }; toolEl.appendChild(b); t.btn = b; });
function setTool(i) { tool = TOOLS[i]; TOOLS.forEach((t) => t.btn.classList.toggle('on', t === tool)); if (tool.id === 'bugs') { critterIdx = (critterIdx + 1) % 4; tool.btn.textContent = '8 ' + CRITTERS[critterIdx].toUpperCase(); } tone(500, 900, 0.06, 0.08); }
setTool(0);
const $ = (id) => document.getElementById(id);
const HYPE = ['MASSIVE!', 'CHAT IS GOING INSANE', 'INSURANCE FRAUD!', 'NO WAY!!', 'CLIP THAT!', 'DEMOLITION GOD', 'MOM IS GONNA KILL ME', 'ABSOLUTE CARNAGE', 'SUBSCRIBE FOR MORE WRECKS'];
function addMoney(v, label, point) {
  if (screen !== 'play' && !attract) return;
  const now = clock.elapsedTime; if (now - lastHit < 1.2) comboT++; else comboT = 0; lastHit = now;
  combo = Math.min(10, 1 + Math.floor(comboT / 6));
  const amt = Math.round(v * combo * rr(0.8, 1.3)); money += amt; ledger[label] = (ledger[label] || 0) + amt;
  if (point && rnd() < 0.5) { const p = point.clone().project(camera); if (p.z < 1) { const el = document.createElement('div'); el.className = 'pop'; el.textContent = '+$' + amt.toLocaleString(); el.style.left = ((p.x + 1) / 2 * innerWidth) + 'px'; el.style.top = ((1 - p.y) / 2 * innerHeight) + 'px'; $('pops').appendChild(el); setTimeout(() => el.remove(), 1000); } }
  if (comboT > 0 && comboT % 12 === 0) hype('x' + combo + ' ' + HYPE[Math.floor(rnd() * HYPE.length)]);
  if (rnd() < 0.15) SFX.cash();
  pulse(0.4 + combo * 0.05, 40);
}
let hypeTimer = 0, chatReq = null, chatT = 6;
function hype(t) { const c = $('combo'); c.textContent = t; c.style.opacity = 1; hypeTimer = 1.4; }

// ---------- damage rules per label ----------
const tmpN = new THREE.Vector3();
function hitNormal(h) { return h.face ? h.face.normal.clone().transformDirection(h.object.matrixWorld).normalize() : new THREE.Vector3(0, 1, 0); }
const PAINT = [0xff2a6d, 0x05d9e8, 0xf9f002, 0x7cff4f, 0xb14aff, 0xff8a00];
function damage(h, t) {
  const o = h.object, u = o.userData, p = h.point, n = hitNormal(h), lab = u.label;
  if (!u.label) return;
  if (u.unknownPending === undefined && lab === 'unknown') identify(o);
  u.hits++;
  const big = t === 'hammer' || t === 'flour';
  switch (t) {
    case 'hammer': SFX.hammer(); decal('crack', p, n, rr(0.35, 0.55)); chunks(p, n, o.material.color?.getHex?.() ?? 0x999999, 6); u.hp -= 1.5; break;
    case 'saw': SFX.saw(); decal('gash', p, n, rr(0.06, 0.1), 0xffffff, clock.elapsedTime * 3 % 6.28, 5, THREE.NormalBlending); sparks(p, n, 2, 0xff8a20); u.hp -= 0.25; break;
    case 'flame': SFX.flame(); ignite(o, p, n); u.hp -= 0.2; break;
    case 'gun': SFX.gun(); decal('hole', p, n, rr(0.06, 0.09)); sparks(p, n, 4); u.hp -= 0.3; break;
    case 'paint': SFX.paint(); decal('splat', p, n, rr(0.4, 0.8), PAINT[Math.floor(rnd() * PAINT.length)]); u.hp -= 0.4; break;
    case 'stamp': SFX.stamp(); decal('stamp', p, n, 0.25, 0xffffff, rr(-0.4, 0.4), 2); u.hp -= 0.4; break;
    case 'flour': SFX.flour(); decal('splat', p, n, rr(0.8, 1.3), 0xf4f1ea); puffs(p.clone().addScaledVector(n, 0.2), 18, 0xffffff, 0.5); u.hp -= 1; break;
    case 'bugs': SFX.bug(); release(p, n, o); break;
  }
  // label flavor on every hit
  if (lab === 'couch' && big) puffs(p, 6, 0xfff8e0, 0.15, 1.5, 1.5);
  if (lab === 'bed' && (big || t === 'saw')) for (let i = 0; i < 4; i++) { const f = sprite('puff', 0xffffff, false); f.scale.setScalar(0.07); f.position.copy(p); particle(f, new THREE.Vector3(rr(-1, 1), rr(1, 3), rr(-1, 1)), 4, 0.5, { drag: 1 }); }
  if (lab === 'screen' && u.glow && !u.dead) { u.glow.material.color.setHex([0xff00ff, 0x00ff88, 0xffffff, 0x2a6cff][u.hits % 4]); sparks(p, n, 6, 0x88ccff); }
  if (lab === 'window') { if (t !== 'paint' && t !== 'stamp') shatterWindow(o, p, n); }
  if ((lab === 'wall' || lab === 'ceiling') && (t === 'hammer' || t === 'saw' || t === 'gun')) { u.local = u.local || []; const near = u.local.filter((q) => q.distanceTo(p) < 0.4).length; u.local.push(p.clone()); if (near >= (t === 'hammer' ? 2 : 14) && !u.local.holes?.some((q) => q.distanceTo(p) < 0.5)) { (u.local.holes = u.local.holes || []).push(p.clone()); decal('sky', p, n, rr(0.8, 1.2), 0xffffff, rnd()); chunks(p, n, 0xd8cbb0, 14, 0.12, 4); SFX.crash(); hype('THE CITY IS BURNING OUT THERE'); addMoney(u.value * 6, lab + ' (hole to apocalypse)', p); } }
  if (lab === 'ceiling' && t === 'hammer') chunks(p, n, 0xdddddd, 5, 0.1, 0.5);
  if (lab === 'floor' && t === 'hammer') decal('scorch', p, n, 0.5, 0x553322);
  if (u.isFridgeDoor) openFridge();
  const req = chatReq && chatReq.id === t ? 2 : 1; if (req > 1 && rnd() < 0.08) hype('CHAT APPROVES THE ' + chatReq.name.slice(2));
  addMoney(u.value * req * (t === 'hammer' ? 1 : t === 'flour' ? 1.2 : 0.35), lab, p);
  if (u.hp <= 0 && !u.dead) destroy(o, p, n);
}
function destroy(o, p, n) {
  const u = o.userData; u.dead = true; const lab = u.label; addMoney(u.value * 8, lab + ' (totaled)', p); SFX.crash(); pulse(1, 120);
  hype(lab.toUpperCase() + ' DESTROYED!');
  switch (lab) {
    case 'table': case 'chair': case 'storage': case 'couch': case 'bed': { chunks(p, n, o.material.color.getHex(), 18, 0.12, 5); const par = o.parent; o.visible = false; surfaces.splice(surfaces.indexOf(o), 1); if (lab === 'storage') for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(chunkGeo, mat(PAINT[i])); b.scale.set(0.2, 0.28, 0.05); b.position.copy(p); particle(b, new THREE.Vector3(rr(-2, 2), rr(2, 4), rr(-2, 2)), 4, 9.8, { spin: new THREE.Vector3(5, 3, 0), bounce: true }); } if (lab === 'couch' || lab === 'bed') puffs(p, 30, 0xffffff, 0.25, 2, 3); break; }
    case 'screen': if (u.glow) u.glow.material.color.setHex(0x050505); decal('crack', p, n, 0.9, 0x88ccff); sparks(p, n, 30, 0x88ccff); break;
    case 'lamp': lampLight.intensity = 0; sparks(p, n, 30); o.rotation.z = 1.2; o.position.y -= 0.4; break;
    case 'plant': chunks(p, n, 0x2e9e44, 20, 0.08, 4); chunks(p, n, 0x4a2a10, 12, 0.05, 3); o.visible = false; surfaces.splice(surfaces.indexOf(o), 1); break;
    case 'wall art': { const f = u.pic ? o : null; const fr = o; fr.userData.falling = true; artFall.push(o); if (u.pic) artFall.push(u.pic); break; }
    case 'door frame': o.rotation.y = 1.3; o.position.x -= 0.3; o.position.z -= 0.4; break;
    case 'fridge': openFridge(); chunks(p, n, 0xe8eef2, 16, 0.12, 4); break;
    default: u.dead = false; u.hp = u.maxhp; // structural surfaces never die, they keep bleeding money
  }
}
const artFall = [];
function shatterWindow(o, p, n) {
  const u = o.userData; if (u.broken) return; u.broken = true; SFX.glass(); pulse(1, 150);
  for (let i = 0; i < 40; i++) { const s = new THREE.Mesh(new THREE.TetrahedronGeometry(rr(0.03, 0.09)), new THREE.MeshStandardMaterial({ color: 0xbfe8ff, transparent: true, opacity: 0.7, metalness: 0.6, roughness: 0.05 })); s.position.copy(p).add(new THREE.Vector3(0, rr(-0.4, 0.4), rr(-0.6, 0.6))); particle(s, n.clone().multiplyScalar(rr(1, 4)).add(new THREE.Vector3(rr(-1, 1), rr(0, 2), rr(-1, 1))), 3, 9.8, { spin: new THREE.Vector3(9, 7, 3), bounce: true }); }
  o.material = new THREE.MeshBasicMaterial({ map: TEX.sky, transparent: true }); o.material.needsUpdate = true;
  hype('GLASS GONE! THE SKY IS ON FIRE'); addMoney(u.value * 10, 'window', p);
}
// fire spreads over the surface it lands on
const fires = [];
function ignite(o, p, n) { if (fires.length >= 20) return; const s = sprite('fire', 0xffffff, true); s.scale.setScalar(rr(0.2, 0.35)); s.position.copy(p).addScaledVector(n, 0.1); scene.add(s); fires.push({ s, o, p: p.clone(), n: n.clone(), life: rr(4, 7), spread: rr(0.5, 1.2), scorched: false }); }
function updateFires(dt) {
  for (let i = fires.length - 1; i >= 0; i--) { const f = fires[i]; f.life -= dt; f.spread -= dt; f.s.scale.setScalar((0.25 + 0.08 * Math.sin(clock.elapsedTime * 20 + i)) * Math.min(1, f.life)); f.s.position.y += Math.sin(clock.elapsedTime * 9 + i) * 0.002;
    if (!f.scorched && f.life < 3) { f.scorched = true; decal('scorch', f.p, f.n, rr(0.4, 0.7)); addMoney(f.o.userData.value * 0.3, f.o.userData.label + ' (fire)', null); }
    if (f.spread < 0 && f.o.userData.label) { f.spread = rr(0.8, 1.6) / ((f.o.userData.label === 'couch' || f.o.userData.label === 'bed') ? 3 : 1); const t = new THREE.Vector3().randomDirection(); t.addScaledVector(f.n, -t.dot(f.n)).normalize().multiplyScalar(0.3);
      ray.set(f.p.clone().add(t).addScaledVector(f.n, 0.2), f.n.clone().negate()); const h = ray.intersectObjects(surfaces, false)[0]; if (h && h.distance < 0.5) ignite(h.object, h.point, hitNormal(h)); }
    if (f.life <= 0) { scene.remove(f.s); fires.splice(i, 1); } }
}
// creatures crawl over real surfaces and eat them
const bugs = [];
const bugGeo = { 'fire ants': new THREE.SphereGeometry(0.02, 5, 4), 'wasp swarm': new THREE.ConeGeometry(0.025, 0.07, 5), 'camel crickets': new THREE.SphereGeometry(0.045, 6, 4), 'horsehair worms': new THREE.CylinderGeometry(0.006, 0.006, 0.3, 4) };
const bugCol = { 'fire ants': 0xc01010, 'wasp swarm': 0xffcc00, 'camel crickets': 0x8a6a3a, 'horsehair worms': 0x2a2018 };
function release(p, n, o) {
  const kind = CRITTERS[critterIdx]; const cnt = kind === 'fire ants' ? 6 : kind === 'wasp swarm' ? 4 : kind === 'camel crickets' ? 3 : 2;
  for (let i = 0; i < cnt; i++) { const m = new THREE.Mesh(bugGeo[kind], mat(bugCol[kind])); m.position.copy(p).addScaledVector(n, 0.02); scene.add(m);
    const dir = new THREE.Vector3().randomDirection(); dir.addScaledVector(n, -dir.dot(n)).normalize();
    bugs.push({ m, kind, o, n: n.clone(), dir, life: rr(10, 16), eat: rr(0.3, 1.2), hop: 0, center: p.clone().addScaledVector(n, 0.4), ph: rnd() * 6 }); }
  hype(kind.toUpperCase() + ' RELEASED!');
}
function updateBugs(dt) {
  for (let i = bugs.length - 1; i >= 0; i--) { const b = bugs[i]; b.life -= dt; b.eat -= dt;
    if (b.kind === 'wasp swarm') { b.ph += dt * 6; b.m.position.set(b.center.x + Math.cos(b.ph + i) * 0.4, b.center.y + Math.sin(b.ph * 1.7 + i) * 0.2, b.center.z + Math.sin(b.ph + i) * 0.4); b.center.addScaledVector(b.dir, dt * 0.3);
      if (b.eat < 0) { b.eat = rr(0.6, 1.4); ray.set(b.m.position, new THREE.Vector3().randomDirection()); const h = ray.intersectObjects(surfaces, false)[0]; if (h && h.distance < 1.5) { decal('bite', h.point, hitNormal(h), 0.08, 0xffee88); addMoney(h.object.userData.value * 0.2, h.object.userData.label + ' (wasps)', null); } } }
    else { const sp = b.kind === 'fire ants' ? 0.25 : b.kind === 'camel crickets' ? 0.15 : 0.08; b.dir.applyAxisAngle(b.n, rr(-3, 3) * dt);
      if (b.kind === 'camel crickets') { b.hop += dt; if (b.hop > 0.7) { b.hop = 0; b.m.position.addScaledVector(b.dir, 0.25); } }
      else b.m.position.addScaledVector(b.dir, sp * dt);
      if (b.kind === 'horsehair worms') { b.m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.dir); b.m.rotateZ(Math.sin(clock.elapsedTime * 8 + i) * 0.5); }
      // stick to the surface below
      ray.set(b.m.position.clone().addScaledVector(b.n, 0.15), b.n.clone().negate()); const h = ray.intersectObjects(surfaces, false)[0];
      if (h && h.distance < 0.4) { b.m.position.copy(h.point).addScaledVector(hitNormal(h), 0.02); b.n = hitNormal(h); b.o = h.object; } else b.dir.negate();
      if (b.eat < 0) { b.eat = rr(0.4, 1); decal('bite', b.m.position, b.n, b.kind === 'camel crickets' ? 0.12 : 0.06); addMoney((b.o.userData.value || 50) * 0.15, (b.o.userData.label || 'stuff') + ' (' + b.kind + ')', null); } }
    if (b.life <= 0) { scene.remove(b.m); bugs.splice(i, 1); } }
}

// ---------- fridge & food ----------
const FOODS = [
  { name: 'ketchup', color: 0xd01010, geo: () => new THREE.CylinderGeometry(0.04, 0.05, 0.2, 8), splat: 0xc80000, size: 0.6 },
  { name: 'eggs', color: 0xfff6e0, geo: () => new THREE.SphereGeometry(0.04, 8, 6), splat: 0xffd21a, size: 0.35 },
  { name: 'milk', color: 0xffffff, geo: () => new THREE.BoxGeometry(0.1, 0.22, 0.1), splat: 0xfdfdf8, size: 0.9 },
  { name: 'flour', color: 0xf0e8d0, geo: () => new THREE.BoxGeometry(0.14, 0.2, 0.08), splat: 0xffffff, size: 1.1, cloud: true },
  { name: 'watermelon', color: 0x2f8a2f, geo: () => new THREE.SphereGeometry(0.16, 10, 8), splat: 0xff3a5a, size: 1.0, chunks: 0xff3a5a },
  { name: 'pizza', color: 0xe8a33a, geo: () => new THREE.CylinderGeometry(0.17, 0.17, 0.02, 3), splat: 0xd8461c, size: 0.7 },
];
const foods = []; // thrown items in flight
function openFridge() { if (!fridge || fridge.opened) return; fridge.opened = true; hype('FRIDGE RAID!'); SFX.crash();
  const base = fridge.g.position.clone().add(new THREE.Vector3(0.4, 1.0, 0.4));
  FOODS.forEach((f, i) => { const m = new THREE.Mesh(f.geo(), mat(f.color)); m.position.copy(base).add(new THREE.Vector3(0, i * 0.12 - 0.3, 0)); scene.add(m); foods.push({ m, f, vel: new THREE.Vector3(rr(0.5, 1.5), rr(1, 2.5), rr(0.5, 1.5)), resting: false, held: false }); }); }
function throwFood(item, dir) { item.held = false; item.resting = false; item.m.position.copy(camera.position).addScaledVector(dir, 0.4); item.vel.copy(dir).multiplyScalar(9).add(new THREE.Vector3(0, 1.5, 0)); }
function updateFoods(dt) {
  for (let i = foods.length - 1; i >= 0; i--) { const it = foods[i]; if (it.resting || it.held) continue; const prev = it.m.position.clone(); it.vel.y -= 9.8 * dt; it.m.position.addScaledVector(it.vel, dt); it.m.rotation.x += dt * 5;
    const seg = it.m.position.clone().sub(prev); const len = seg.length(); if (len < 1e-5) continue; ray.set(prev, seg.normalize()); const h = ray.intersectObjects(surfaces, false)[0];
    if (h && h.distance <= len + 0.05) { const n = hitNormal(h); const sp = it.vel.length(); if (sp > 3) { decal('splat', h.point, n, it.f.size * rr(0.8, 1.2), it.f.splat); SFX.paint(); if (it.f.cloud) puffs(h.point, 20, 0xffffff, 0.5); if (it.f.chunks) chunks(h.point, n, it.f.chunks, 14, 0.07, 3); if (it.f.name === 'eggs') chunks(h.point, n, 0xfffaf0, 6, 0.03, 2); addMoney(220, (h.object.userData.label || 'stuff') + ' (' + it.f.name + ')', h.point); if (h.object.userData.label === 'window') shatterWindow(h.object, h.point, n); scene.remove(it.m); foods.splice(i, 1); }
      else { it.m.position.copy(h.point).addScaledVector(n, 0.08); it.vel.set(0, 0, 0); it.resting = true; } } }
}

// ---------- grab & throw furniture ----------
let held = null; // furniture or food
function grabOrThrow(dir) {
  if (held) { if (held.f) throwFood(held, dir); else { held.flying = true; held.vel.copy(dir).multiplyScalar(10 / held.mass).add(new THREE.Vector3(0, 2, 0)); held.spin = rr(4, 8); SFX.flame(); } held = null; return; }
  // nearest food first, then furniture along the aim
  let best = null, bd = 1e9;
  for (const it of foods) { const d = distToRay(it.m.position, dir); if (d < 0.35 && it.m.position.distanceTo(camera.position) < 5) { if (d < bd) { bd = d; best = it; } } }
  for (const fu of furniture) { if (fu.flying) continue; const c = fu.g.position.clone().add(new THREE.Vector3(0, 0.4, 0)); const d = distToRay(c, dir); if (d < 0.6 && d < bd) { bd = d; best = fu; } }
  if (best) { held = best; if (best.f) best.held = true; tone(200, 600, 0.15, 0.1); hype(best.f ? 'GOT ' + best.f.name.toUpperCase() + '!' : 'YOINK! ' + best.label.toUpperCase()); }
}
function distToRay(p, dir) { const v = p.clone().sub(camera.position); const t = v.dot(dir); if (t < 0) return 1e9; return v.addScaledVector(dir, -t).length(); }
function updateFurniture(dt) {
  if (held) { const target = camera.position.clone().addScaledVector(aimDir(), held.f ? 0.5 : 1.3); if (held.f) held.m.position.lerp(target, 0.4); else { target.y -= 0.6; held.g.position.lerp(target, 0.25); held.g.rotation.y += dt; } }
  for (const fu of furniture) { if (!fu.flying) continue; fu.vel.y -= 9.8 * dt; fu.g.position.addScaledVector(fu.vel, dt); fu.g.rotation.x += fu.spin * dt; fu.g.rotation.z += fu.spin * 0.6 * dt;
    const p = fu.g.position; let hit = null;
    if (Math.abs(p.x) > W / 2 - 0.35) { hit = new THREE.Vector3(Math.sign(p.x), 0, 0); p.x = Math.sign(p.x) * (W / 2 - 0.35); fu.vel.x *= -0.3; }
    if (Math.abs(p.z) > D / 2 - 0.35) { hit = new THREE.Vector3(0, 0, Math.sign(p.z)); p.z = Math.sign(p.z) * (D / 2 - 0.35); fu.vel.z *= -0.3; }
    if (p.y < 0) { p.y = 0; fu.vel.y *= -0.3; fu.vel.x *= 0.7; fu.vel.z *= 0.7; if (fu.vel.length() < 0.6) { fu.flying = false; fu.g.rotation.x = Math.round(fu.g.rotation.x / Math.PI) * Math.PI; fu.g.rotation.z = 0; if (Math.abs(fu.g.rotation.x) > 1) fu.g.position.y = 0.9; } }
    if (hit) { const wp = p.clone().add(new THREE.Vector3(0, 0.5, 0)).addScaledVector(hit, 0.34); ray.set(wp.clone().addScaledVector(hit, -0.5), hit); const h = ray.intersectObjects(surfaces.filter((s) => !isChild(s, fu.g)), false)[0];
      if (h) { if (h.object.userData.label === 'window' || h.object.userData.label === 'window frame') { const g = surfaces.find((s) => s.userData.label === 'window'); shatterWindow(g, h.point, hitNormal(h)); } decal('crack', h.point, hitNormal(h), 0.8); chunks(h.point, hitNormal(h), 0xd8cbb0, 10, 0.1, 3); SFX.crash(); addMoney(400 * fu.mass, fu.label + ' thrown into ' + h.object.userData.label, h.point); hype('YEET!'); pulse(1, 100); } } }
}
function isChild(o, g) { while (o) { if (o === g) return true; o = o.parent; } return false; }

// ---------- input (desktop / touch) ----------
const ray = new THREE.Raycaster();
let yaw = 0, pitch = -0.05; const keys = {}; let mouseDown = false, dragMoved = 0, lastX = 0, lastY = 0, aimNDC = new THREE.Vector2(0, 0), fireCD = 0;
function aimDir() { ray.setFromCamera(aimNDC, camera); return ray.ray.direction.clone(); }
function fire() {
  if (tool.id === 'grab') { grabOrThrow(aimDir()); return; }
  ray.setFromCamera(aimNDC, camera); const h = ray.intersectObjects(surfaces.filter((s) => s.visible), false)[0];
  if (h) damage(h, tool.id);
  if (tool.id === 'flame') { const s = sprite('fire', 0xffffff, true); s.scale.setScalar(0.15); s.position.copy(camera.position).addScaledVector(ray.ray.direction, 0.5).add(new THREE.Vector3(0, -0.2, 0)); particle(s, ray.ray.direction.clone().multiplyScalar(6), 0.35, 0, { grow: 0.6 }); }
}
function start() { if (screen === 'play') return; resetGame(); screen = 'play'; attract = false; $('title').classList.add('hide'); $('over').classList.add('hide'); $('hud').classList.remove('hide'); audio(); startBgm(); actx?.resume?.(); hype('LET\'S GOOO!'); }
addEventListener('keydown', (e) => { keys[e.code] = true; idleT = 0;
  if (screen !== 'play') { if (e.code === 'Enter' || e.code === 'Space') { if (screen === 'over' && overT < 0.6) return; start(); } return; }
  if (/^Digit[1-9]$/.test(e.code)) setTool(+e.code.slice(5) - 1);
  if (e.code === 'KeyG') grabOrThrow(aimDir()); if (e.code === 'KeyF') openFridge();
  if (e.code === 'Space') { fire(); } });
addEventListener('keyup', (e) => { keys[e.code] = false; });
renderer.domElement.addEventListener('pointerdown', (e) => { idleT = 0; if (screen !== 'play') { if (screen === 'title') start(); return; } mouseDown = true; dragMoved = 0; lastX = e.clientX; lastY = e.clientY; setAim(e); fireCD = 0; if (!tool.hold) fire(); });
addEventListener('pointermove', (e) => { if (!mouseDown) { if (e.pointerType === 'mouse' && screen === 'play') setAim(e); return; } const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; dragMoved += Math.abs(dx) + Math.abs(dy); if (e.pointerType !== 'mouse' && dragMoved > 12) { yaw -= dx * 0.005; pitch = Math.max(-1.3, Math.min(1.3, pitch - dy * 0.005)); } else setAim(e); });
addEventListener('pointerup', () => { mouseDown = false; });
function setAim(e) { aimNDC.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); const c = $('cross'); c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }
$('playBtn').onclick = start; $('againBtn').onclick = () => { if (overT > 0.6) start(); };
addEventListener('contextmenu', (e) => e.preventDefault());

// ---------- controllers + hands (XR) ----------
let xrSession = null, xrRefSpace = null, hitSource = null;
const xrPlanes = new Map(); const xrMeshes = new Map();
const depthOnly = new THREE.MeshBasicMaterial({ colorWrite: false });
const wheel = new THREE.Group(); scene.add(wheel); wheel.visible = false;
const wheelItems = TOOLS.map((t, i) => { const c = canvasTex(128, 64, (g) => { g.fillStyle = '#000c'; g.fillRect(0, 0, 128, 64); g.fillStyle = '#ffde3a'; g.font = 'bold 22px Impact,sans-serif'; g.textAlign = 'center'; g.fillText(t.name, 64, 40); }); const m = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.035), new THREE.MeshBasicMaterial({ map: c, transparent: true })); const a = i / TOOLS.length * Math.PI * 2; m.position.set(Math.cos(a) * 0.1, Math.sin(a) * 0.1, 0); m.userData.idx = i; wheel.add(m); return m; });
function pulse(intensity, ms) { const s = renderer.xr.getSession?.(); if (!s) return; for (const src of s.inputSources) { const h = src.gamepad?.hapticActuators?.[0]; if (h?.pulse) h.pulse(Math.min(1, intensity), ms); else if (src.gamepad?.vibrationActuator?.playEffect) src.gamepad.vibrationActuator.playEffect('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, intensity) }); } }
async function enterAR() {
  try { xrSession = await navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['local-floor'], optionalFeatures: ['hand-tracking', 'plane-detection', 'mesh-detection', 'hit-test', 'anchors'] }); }
  catch (e) { hype('AR NOT AVAILABLE'); return; }
  room.visible = false; scene.background = null; renderer.xr.setReferenceSpaceType('local-floor'); await renderer.xr.setSession(xrSession); xrRefSpace = renderer.xr.getReferenceSpace();
  xrSession.requestReferenceSpace('viewer').then((vs) => xrSession.requestHitTestSource?.({ space: vs })).then((s) => { hitSource = s; }).catch(() => {});
  surfaces.length = 0; furniture.length = 0; fridge = null; for (const it of foods) scene.remove(it.m); foods.length = 0;
  xrSession.addEventListener('selectstart', (e) => { xrFire(e.inputSource, e.frame); });
  xrSession.addEventListener('end', () => { xrSession = null; room.visible = true; scene.background = new THREE.Color(0x1a1420); location.reload(); });
  $('title').classList.add('hide'); resetGame(); screen = 'play'; $('hud').classList.remove('hide');
}
if (navigator.xr?.isSessionSupported) navigator.xr.isSessionSupported('immersive-ar').then((ok) => { if (ok) { $('arBtn').classList.remove('hide'); $('arBtn').onclick = enterAR; } }).catch(() => {});
function geomFromPolygon(poly) { const shape = new THREE.Shape(poly.map((p) => new THREE.Vector2(p.x, -p.z))); const g = new THREE.ShapeGeometry(shape); g.rotateX(-Math.PI / 2); return g; }
const LABEL_MAP = { 'wall art': 'wall art', 'window frame': 'window', 'door frame': 'door frame', other: 'unknown' };
function syncWorld(frame) {
  const planes = frame.detectedPlanes; if (planes) { planes.forEach((pl) => { let m = xrPlanes.get(pl); if (!m) { m = new THREE.Mesh(geomFromPolygon(pl.polygon), depthOnly); m.matrixAutoUpdate = false; scene.add(m); const lab = LABEL_MAP[pl.semanticLabel] || pl.semanticLabel || 'unknown'; surf(m, LABEL_HP[lab] ? lab : 'unknown'); m.userData.xrLabel = pl.semanticLabel; xrPlanes.set(pl, m); } const pose = frame.getPose(pl.planeSpace, xrRefSpace); if (pose) { m.matrix.fromArray(pose.transform.matrix); m.updateMatrixWorld(true); } }); }
  const meshes = frame.detectedMeshes; if (meshes) { meshes.forEach((xm) => { let m = xrMeshes.get(xm); if (!m) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(xm.vertices, 3)); g.setIndex(new THREE.BufferAttribute(xm.indices, 1)); g.computeVertexNormals(); m = new THREE.Mesh(g, depthOnly); m.matrixAutoUpdate = false; scene.add(m); const lab = LABEL_MAP[xm.semanticLabel] || xm.semanticLabel || 'unknown'; surf(m, LABEL_HP[lab] ? lab : 'unknown'); if (lab === 'table' || lab === 'chair' || lab === 'couch') m.userData.grabbable = true; xrMeshes.set(xm, m); } const pose = frame.getPose(xm.meshSpace, xrRefSpace); if (pose) { m.matrix.fromArray(pose.transform.matrix); m.updateMatrixWorld(true); } }); }
  if (!fridge && frame.detectedMeshes && [...xrMeshes.values()].length && !surfaces.some((s) => s.userData.xrLabel === 'refrigerator')) { makeFridge(0.8, -1.2); room.visible = true; room.children.forEach((c) => { c.visible = c === fridge.g; }); }
}
async function identify(o) {
  o.userData.unknownPending = true;
  const fallback = { name: 'mystery object', material: 'mixed material', breakStyle: 'shatter' };
  try { const img = renderer.domElement.toDataURL('image/jpeg', 0.5); const r = await fetch('/api/identify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: img }) }); const j = r.ok ? await r.json() : fallback; const result = j?.name ? j : fallback; o.userData.label = String(result.name).slice(0, 24); o.userData.material = result.material; o.userData.breakStyle = result.breakStyle; hype('THAT\'S A ' + o.userData.label.toUpperCase() + '!'); } catch { o.userData.label = fallback.name; o.userData.material = fallback.material; o.userData.breakStyle = fallback.breakStyle; }
}
const hands = { left: null, right: null };
function joint(frame, hand, name) { const j = hand?.get(name); if (!j) return null; const p = frame.getJointPose?.(j, xrRefSpace); return p ? p.transform : null; }
let pinchWas = { left: false, right: false }, twoGrab = null;
function xrFire(src, frame) {
  const pose = src.targetRaySpace && frame?.getPose(src.targetRaySpace, xrRefSpace); if (!pose) return;
  const o = pose.transform.position, q = pose.transform.orientation; const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion(q.x, q.y, q.z, q.w));
  ray.set(new THREE.Vector3(o.x, o.y, o.z), dir); const h = ray.intersectObjects(surfaces, false)[0]; if (h) damage(h, tool.id); pulse(0.6, 30);
}
function updateXR(frame) {
  syncWorld(frame);
  for (const src of xrSession.inputSources) { if (src.hand) hands[src.handedness] = src; }
  const L = hands.left?.hand, R = hands.right?.hand;
  // palm-up left hand opens the tool wheel
  const lw = joint(frame, L, 'wrist'), lm = joint(frame, L, 'middle-finger-metacarpal');
  if (lw && lm) { const q = new THREE.Quaternion(lw.orientation.x, lw.orientation.y, lw.orientation.z, lw.orientation.w); const palmN = new THREE.Vector3(0, -1, 0).applyQuaternion(q); wheel.visible = palmN.y < -0.6 ? false : palmN.y > 0.6; if (wheel.visible) { wheel.position.set(lm.position.x, lm.position.y + 0.12, lm.position.z); wheel.lookAt(camera.position); } } else wheel.visible = false;
  const rt = joint(frame, R, 'index-finger-tip'), rth = joint(frame, R, 'thumb-tip');
  if (rt && wheel.visible) { const tip = new THREE.Vector3(rt.position.x, rt.position.y, rt.position.z); for (const it of wheelItems) { const wp = it.getWorldPosition(new THREE.Vector3()); if (wp.distanceTo(tip) < 0.025) setTool(it.userData.idx); } }
  for (const side of ['left', 'right']) { const h = hands[side]?.hand; const a = joint(frame, h, 'index-finger-tip'), b = joint(frame, h, 'thumb-tip'); if (!a || !b) continue; const pinch = Math.hypot(a.position.x - b.position.x, a.position.y - b.position.y, a.position.z - b.position.z) < 0.02;
    if (side === 'right' && pinch && !wheel.visible) { fireCD -= 1 / 72; if (fireCD <= 0) { fireCD = tool.rate; xrFire(hands.right, frame); } }
    hands[side].pinch = pinch; hands[side].pos = new THREE.Vector3(a.position.x, a.position.y, a.position.z); }
  // two-hand grab: both pinching near a detected chair/table/couch mesh
  if (hands.left?.pinch && hands.right?.pinch) { const mid = hands.left.pos.clone().add(hands.right.pos).multiplyScalar(0.5); if (!twoGrab) { const tgt = surfaces.find((s) => s.userData.grabbable && s.getWorldPosition(new THREE.Vector3()).distanceTo(mid) < 0.8); if (tgt) { twoGrab = { m: tgt, last: mid.clone(), vel: new THREE.Vector3() }; } } else { twoGrab.vel.copy(mid).sub(twoGrab.last).multiplyScalar(72); twoGrab.last.copy(mid); twoGrab.m.matrix.setPosition(mid); twoGrab.m.updateMatrixWorld(true); } }
  else if (twoGrab) { const v = twoGrab.vel; ray.set(twoGrab.last, v.clone().normalize()); const h = ray.intersectObjects(surfaces.filter((s) => s !== twoGrab.m), false)[0]; if (h && v.length() > 1.5) { if (h.object.userData.label === 'window') shatterWindow(h.object, h.point, hitNormal(h)); decal('crack', h.point, hitNormal(h), 0.8); SFX.crash(); addMoney(1200, twoGrab.m.userData.label + ' thrown', h.point); } twoGrab = null; }
}

// ---------- optional GLB models ----------
(async () => { try { const r = await fetch('./public/models/manifest.json'); if (!r.ok) return; const list = await r.json(); if (!Array.isArray(list) || !list.length) return; const { GLTFLoader } = await import('./vendor/GLTFLoader.js'); const loader = new GLTFLoader();
  for (const name of list) loader.load('./public/models/' + name + '.glb', (gltf) => { const tgt = name === 'fridge' ? fridge?.g : furniture.find((f) => f.label === name)?.g; if (!tgt) return; tgt.children.forEach((c) => { c.material = c.material.clone(); c.material.visible = false; }); tgt.add(gltf.scene); }); } catch { /* procedural models stay */ } })();

// ---------- attract mode bot ----------
const bot = { t: 0, step: 0 };
function attractTick(dt) {
  bot.t -= dt; yaw += Math.sin(clock.elapsedTime * 0.3) * dt * 0.5; pitch = -0.1 + Math.sin(clock.elapsedTime * 0.5) * 0.25;
  if (bot.t <= 0) { bot.step++; bot.t = 0.12; if (bot.step % 25 === 0) setTool(Math.floor(rnd() * 8)); aimNDC.set(rr(-0.6, 0.6), rr(-0.5, 0.5)); fire(); }
}

// ---------- flow ----------
let overT = 0;
function resetGame() { chatReq = null; chatT = 6; timeLeft = 90; money = 0; combo = 1; comboT = 0; for (const k in ledger) delete ledger[k]; for (const d of decals) scene.remove(d); decals.length = 0; for (const p of parts) scene.remove(p.mesh); parts.length = 0; for (const f of fires) scene.remove(f.s); fires.length = 0; for (const b of bugs) scene.remove(b.m); bugs.length = 0; for (const it of foods) scene.remove(it.m); foods.length = 0; held = null; artFall.length = 0;
  if (!xrSession) { room.clear(); surfaces.length = 0; furniture.length = 0; buildRoom(); lampLight.intensity = 6; } seed = 1337; yaw = 0; pitch = -0.05; }
const JOKES = [['Emotional support for houseplant', 480], ['Wasp relocation consultant', 1299], ['"It was like that when I got here" fee', 750], ['Livestream licensing (chat clipped it)', 2400], ['Apocalypse visible through wall surcharge', 6666], ['Landlord therapy, 12 sessions', 3600]];
function gameOver() { screen = 'over'; overT = 0; $('hud').classList.add('hide'); held = null;
  const rows = Object.entries(ledger).sort((a, b) => b[1] - a[1]).slice(0, 10); let total = money; let html = '<h2>WRECKSURE MUTUAL<br>INSURANCE CLAIM #' + (100000 + Math.floor(money % 899999)) + '</h2><div style="text-align:center">Policyholder: YOU (allegedly)</div><br>';
  for (const [k, v] of rows) html += `<div class="row"><span>${k}</span><span>$${v.toLocaleString()}</span></div>`;
  for (const [k, v] of JOKES.slice(0, 3 + Math.floor(money / 50000) % 4)) { html += `<div class="row"><span>${k}</span><span>$${v.toLocaleString()}</span></div>`; total += v; }
  html += `<div class="row tot"><span>TOTAL CLAIM</span><span>$${total.toLocaleString()}</span></div><div class="row"><span>Max combo</span><span>x${combo}</span></div><div class="row"><span>Covered by policy</span><span>$0.00</span></div><p style="text-align:center">Cause of loss: "a guy on stream told me to"</p><div class="stamp">CLAIM DENIED</div><p style="text-align:center">TAP / ENTER TO WRECK AGAIN</p>`;
  $('receipt').innerHTML = html; $('over').classList.remove('hide'); SFX.stamp(); }
addEventListener('pointerdown', () => { if (screen === 'over' && overT > 0.6) start(); });

// ---------- main loop ----------
const clock = new THREE.Clock();
const tmpV = new THREE.Vector3();
const frameTimes = [];
renderer.setAnimationLoop((t, frame) => {
  const workStart = performance.now();
  const dt = Math.min(0.05, clock.getDelta());
  if (frame && xrSession) updateXR(frame);
  if (screen === 'title') { idleT += dt; if (idleT > 8) { attract = true; attractTick(dt); } }
  if (screen === 'play') {
    chatT -= dt; if (chatT <= 0) { chatT = 12; chatReq = TOOLS[Math.floor(rnd() * 8)]; hype('CHAT SAYS: USE THE ' + chatReq.name.slice(2) + '! 2X CASH'); TOOLS.forEach((x) => { x.btn.style.boxShadow = x === chatReq ? '0 0 12px 4px #7dff5a' : ''; }); }
    timeLeft -= dt; if (timeLeft <= 0) { timeLeft = 0; gameOver(); }
    if (keys.ArrowLeft || keys.KeyA) yaw += dt * 1.8; if (keys.ArrowRight || keys.KeyD) yaw -= dt * 1.8; if (keys.ArrowUp || keys.KeyW) pitch = Math.min(1.3, pitch + dt * 1.2); if (keys.ArrowDown || keys.KeyS) pitch = Math.max(-1.3, pitch - dt * 1.2);
    fireCD -= dt; if (mouseDown && tool.hold && fireCD <= 0 && !xrSession) { fire(); fireCD = tool.rate; }
    $('money').firstChild.nodeValue = '$' + money.toLocaleString(); $('timer').textContent = Math.ceil(timeLeft) + (combo > 1 ? '  x' + combo : '');
    if (timeLeft < 10) $('timer').style.color = (Math.floor(timeLeft * 4) % 2) ? '#ff3d3d' : '#ffde3a'; else $('timer').style.color = '#ffde3a';
  }
  if (screen === 'over') overT += dt;
  if (!xrSession) { camera.rotation.set(pitch, yaw, 0, 'YXZ'); }
  hypeTimer -= dt; if (hypeTimer < 0) $('combo').style.opacity = 0;
  // particles
  for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.life -= dt; p.vel.y -= p.grav * dt; if (p.drag) p.vel.multiplyScalar(1 - p.drag * dt); p.mesh.position.addScaledVector(p.vel, dt);
    if (p.spin) { p.mesh.rotation.x += p.spin.x * dt; p.mesh.rotation.y += p.spin.y * dt; }
    if (p.bounce && p.mesh.position.y < 0.03 && !xrSession) { p.mesh.position.y = 0.03; p.vel.y *= -0.35; p.vel.x *= 0.6; p.vel.z *= 0.6; if (Math.abs(p.vel.y) < 0.3) { p.spin = null; p.vel.set(0, 0, 0); p.grav = 0; } }
    if (p.grow) { p.mesh.scale.multiplyScalar(1 + dt * 0.8); }
    if (p.mesh.material?.opacity !== undefined && p.mesh.isSprite) p.mesh.material.opacity = 1;
    if (p.life <= 0) { if (p.bounce && parts.length < 600 && p.grav === 0) { p.life = 9999; continue; } scene.remove(p.mesh); parts.splice(i, 1); } }
  for (const a of artFall) { if (a.position.y > 0.1) { a.position.y -= dt * 3; a.rotation.z += dt * 2; } }
  if (fridge) { fridge.open += ((fridge.opened ? 1 : 0) - fridge.open) * dt * 4; fridge.doorPivot.rotation.y = -fridge.open * 1.9; }
  updateFires(dt); updateBugs(dt); updateFoods(dt); updateFurniture(dt);
  renderer.render(scene, camera);
  frameTimes.push(performance.now() - workStart); if (frameTimes.length > 600) frameTimes.shift();
});
buildRoom();

// ---------- test hooks ----------
window.__game = { state: () => ({ screen, money, timeLeft, combo, tool: tool.id, decals: decals.length }), metrics: () => ({ frameMs: [...frameTimes], render: { ...renderer.info.render }, memory: { ...renderer.info.memory }, pixelRatio: renderer.getPixelRatio() }), forceOver: () => { if (screen !== 'play') start(); gameOver(); } };
