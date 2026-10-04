// ===== Floating emojis =====
const floaters = document.getElementById('floaters');
const icons = ['🎀', '💖', '⭐', '✨', '🌸', '🍓', '💕'];
function spawnFloater() {
  const el = document.createElement('span');
  el.className = 'floater';
  el.textContent = icons[Math.floor(Math.random() * icons.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = 16 + Math.random() * 26 + 'px';
  const dur = 8 + Math.random() * 8;
  el.style.animationDuration = dur + 's';
  floaters.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}
setInterval(spawnFloater, 700);
for (let i = 0; i < 8; i++) setTimeout(spawnFloater, i * 150);

// ===== Typing effect =====  (TODO: sửa danh sách vai trò)
const roles = ['FTUer 🌸', 'International Business Student 🎓', 'Communications Leader 📣', 'Aspiring Researcher 🔬'];
const typingEl = document.getElementById('typing');
let r = 0, c = 0, deleting = false;
function type() {
  const word = roles[r];
  typingEl.textContent = word.slice(0, c);
  if (!deleting && c < word.length) { c++; setTimeout(type, 90); }
  else if (!deleting) { deleting = true; setTimeout(type, 1400); }
  else if (c > 0) { c--; setTimeout(type, 45); }
  else { deleting = false; r = (r + 1) % roles.length; setTimeout(type, 300); }
}
type();

// ===== Sparkle cursor trail =====
let lastSpark = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastSpark < 60) return;
  lastSpark = now;
  const s = document.createElement('span');
  s.className = 'spark';
  s.textContent = ['✨', '💖', '⭐'][Math.floor(Math.random() * 3)];
  s.style.left = e.clientX + 'px';
  s.style.top = e.clientY + 'px';
  s.style.fontSize = 10 + Math.random() * 12 + 'px';
  s.style.setProperty('--dx', (Math.random() - .5) * 60 + 'px');
  s.style.setProperty('--dy', 20 + Math.random() * 40 + 'px');
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
});

// ===== Scroll reveal + skill bars =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('visible');
    en.target.querySelectorAll('.bar i').forEach((b) => (b.style.width = b.dataset.level + '%'));
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ===== Tilt effect on project cards =====
document.querySelectorAll('.tilt').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const b = card.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - .5;
    const y = (e.clientY - b.top) / b.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => (card.style.transform = ''));
});

// ===== Click the mascot =====
const kitty = document.getElementById('kitty');
const bubble = document.getElementById('bubble');
const sayings = ['Meo~ 💕', 'Chào bạn nha! 🎀', 'Xem dự án của mình đi! ✨', 'Hihi, nhột quá 🌸'];
let bubbleTimer;
kitty.addEventListener('click', () => {
  bubble.textContent = sayings[Math.floor(Math.random() * sayings.length)];
  bubble.classList.add('show');
  kitty.classList.remove('jump'); void kitty.offsetWidth; kitty.classList.add('jump');
  for (let i = 0; i < 8; i++) setTimeout(spawnFloater, i * 60);
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 2000);
});

document.getElementById('year').textContent = new Date().getFullYear();

// ===== Active nav link on scroll =====
const navLinks = [...document.querySelectorAll('.nav ul a')];
const spyTargets = navLinks.map((a) => document.querySelector(a.getAttribute('href')));
window.addEventListener('scroll', () => {
  const y = window.scrollY + window.innerHeight * 0.35;
  let idx = 0;
  spyTargets.forEach((t, i) => { if (t && t.offsetTop <= y) idx = i; });
  navLinks.forEach((a, i) => a.classList.toggle('active', i === idx));
}, { passive: true });

// ===== Music player =====
// Thêm file nhạc vào thư mục "music/" rồi sửa danh sách bên dưới.
// Chỉ chạy khi trong index.html có trình phát nhạc (id="player"); nếu đã xóa thì bỏ qua để không làm hỏng phần còn lại.
if (document.getElementById('player')) {
const playlist = [
  { title: 'Blue - BOL4', src: 'music/blue.mp3' },
  { title: 'Bài hát 2', src: 'music/song2.mp3' },
  { title: 'Bài hát 3', src: 'music/song3.mp3' },
];
const audio = document.getElementById('audio');
const playerEl = document.getElementById('player');
const playBtn = document.getElementById('play');
const seek = document.getElementById('seek');
const curEl = document.getElementById('cur');
const durEl = document.getElementById('dur');
const songsSel = document.getElementById('songs');
const muteBtn = document.getElementById('mute');
let track = 0;

const fmt = (s) => (isNaN(s) ? '0:00' : Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'));
playlist.forEach((s, i) => songsSel.add(new Option('💙 ' + s.title, i)));

function load(i, autoplay) {
  track = (i + playlist.length) % playlist.length;
  songsSel.value = track;
  audio.src = playlist[track].src;
  if (autoplay) audio.play().catch(() => {});
}
function setPlayingUI(on) {
  playBtn.textContent = on ? '⏸' : '▶';
  playerEl.classList.toggle('playing', on);
}
load(0, false);

playBtn.onclick = () => (audio.paused ? audio.play().catch(() => alert('Chưa tìm thấy file nhạc. Hãy thêm file vào thư mục music/ nhé 🎵')) : audio.pause());
document.getElementById('next').onclick = () => load(track + 1, true);
document.getElementById('prev').onclick = () => load(track - 1, true);
songsSel.onchange = () => load(+songsSel.value, true);
muteBtn.onclick = () => { audio.muted = !audio.muted; muteBtn.textContent = audio.muted ? '🔇' : '🔊'; };
seek.oninput = () => { if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration; };
audio.onplay = () => setPlayingUI(true);
audio.onpause = () => setPlayingUI(false);
audio.onended = () => load(track + 1, true);
audio.onloadedmetadata = () => (durEl.textContent = fmt(audio.duration));
audio.ontimeupdate = () => {
  curEl.textContent = fmt(audio.currentTime);
  if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
};
} // end music player guard

// ===== Pink sparkle background (twinkling stars + stitched hearts) =====
const sparkleLayer = document.getElementById('sparkle-bg');
const heartSVG = '<svg viewBox="0 0 32 30" width="100%" height="100%"><path d="M16 29C3 19 0 12 0 8a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 4-3 11-16 21z" fill="#f78fb3"/><path d="M16 29C3 19 0 12 0 8a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 4-3 11-16 21z" transform="translate(2.9 2.4) scale(.82)" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1.2" stroke-dasharray="2.5 2.5"/></svg>';
function buildSparkles() {
  sparkleLayer.innerHTML = '';
  const area = window.innerWidth * window.innerHeight;
  const stars = Math.min(40, Math.round(area / 30000));
  const hearts = Math.min(14, Math.round(area / 90000));
  for (let i = 0; i < stars; i++) {
    const s = document.createElement('span');
    const size = 8 + Math.random() * 14;
    s.className = 'tw';
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;--d:${2 + Math.random() * 3}s;animation-delay:${-Math.random() * 4}s`;
    sparkleLayer.appendChild(s);
  }
  for (let i = 0; i < hearts; i++) {
    const h = document.createElement('div');
    const size = 22 + Math.random() * 22;
    h.className = 'sheart';
    h.style.cssText = `left:${Math.random() * 96}%;top:${Math.random() * 92}%;width:${size}px;height:${size * .94}px;--d:${4 + Math.random() * 4}s;animation-delay:${-Math.random() * 5}s`;
    h.innerHTML = heartSVG;
    sparkleLayer.appendChild(h);
  }
}
buildSparkles();
let sparkleTimer;
window.addEventListener('resize', () => { clearTimeout(sparkleTimer); sparkleTimer = setTimeout(buildSparkles, 300); });

// ===== Interactive Hello Kitty stickers =====
// Kéo thả để di chuyển, bấm để mèo nhảy + nói, bấm "🎀 Kitties" để ẩn/hiện.
const stickerLayer = document.getElementById('bg-kitties');
const kittySays = [
  'Meo~ 💕', 'Kéo mình đi chơi nè! 🎀', 'Hihi, nhột quá 🌸', 'Yêu bạn nhiều lắm 💖',
  'Chào mừng đến portfolio của Trần Bảo Châu! ✨', 'Hello Kitty đây ~ 🐱',
];
const stickers = [
  { src: 'images/kitty-bow.jpg',    w: 150, fx: 0.01, fy: 0.58 },
  { src: 'images/kitty-ballet.jpg', w: 120, fx: 0.99, fy: 0.20 },
  { src: 'images/kitty-wink.jpg',   w: 150, fx: 0.99, fy: 0.58, photo: true },
  { src: 'images/kitty-ballet.jpg', w: 95,  fx: 0.01, fy: 0.15 },
];
const clampN = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function burst(x, y, n = 8) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = ['💖', '✨', '🎀', '💕'][Math.floor(Math.random() * 4)];
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.fontSize = 14 + Math.random() * 14 + 'px';
    s.style.setProperty('--dx', (Math.random() - .5) * 180 + 'px');
    s.style.setProperty('--dy', -30 - Math.random() * 90 + 'px');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
}
function say(x, y, text) {
  const b = document.createElement('div');
  b.className = 'k-say';
  b.textContent = text;
  b.style.left = clampN(x, 90, window.innerWidth - 90) + 'px';
  b.style.top = Math.max(y, 60) + 'px';
  document.body.appendChild(b);
  setTimeout(() => b.remove(), 2000);
}
function keepInView(el) {
  const r = el.getBoundingClientRect();
  el.style.left = clampN(r.left, -r.width * .3, window.innerWidth - r.width * .7) + 'px';
  el.style.top = clampN(r.top, 50, window.innerHeight - r.height * .7) + 'px';
}

function makeSticker(d) {
  const el = document.createElement('div');
  el.className = 'sticker' + (d.photo ? ' photo' : '');
  el.style.setProperty('--w', d.w + 'px');
  el.style.setProperty('--dur', 3.5 + Math.random() * 2 + 's');
  el.style.setProperty('--delay', -Math.random() * 3 + 's');
  el.innerHTML = '<div class="in"><img alt="Hello Kitty" draggable="false"></div>';
  const img = el.querySelector('img');
  el.style.left = d.fx * (window.innerWidth - d.w) + 'px';
  el.style.top = d.fy * window.innerHeight + 'px';
  img.onload = () => keepInView(el);
  img.src = d.src;
  img.onerror = () => el.remove();
  stickerLayer.appendChild(el);

  let dragging = false, moved = false, sx = 0, sy = 0, ox = 0, oy = 0, lastX = 0;
  el.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false;
    el.setPointerCapture(e.pointerId);
    const r = el.getBoundingClientRect();
    sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top; lastX = e.clientX;
    el.classList.remove('jump', 'drop');
    el.classList.add('drag');
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    const w = el.offsetWidth, h = el.offsetHeight;
    el.style.left = clampN(ox + dx, -w * .3, window.innerWidth - w * .7) + 'px';
    el.style.top = clampN(oy + dy, 50, window.innerHeight - h * .7) + 'px';
    el.style.setProperty('--tilt', clampN((e.clientX - lastX) * 1.5, -15, 15) + 'deg');
    lastX = e.clientX;
  });
  const release = (poke) => {
    if (!dragging) return;
    dragging = false;
    el.classList.remove('drag');
    el.style.removeProperty('--tilt');
    const r = el.getBoundingClientRect();
    if (moved) {
      el.classList.add('drop');
      setTimeout(() => el.classList.remove('drop'), 500);
    } else if (poke) {
      el.classList.add('jump');
      setTimeout(() => el.classList.remove('jump'), 600);
      burst(r.left + r.width / 2, r.top + r.height / 3);
      say(r.left + r.width / 2, r.top, kittySays[Math.floor(Math.random() * kittySays.length)]);
    }
  };
  el.addEventListener('pointerup', () => release(true));
  el.addEventListener('pointercancel', () => release(false));
  return el;
}
stickers.forEach(makeSticker);
window.addEventListener('resize', () => stickerLayer.querySelectorAll('.sticker').forEach(keepInView));

// một bé mèo múa ba lê chạy ngang màn hình, bấm vào để bắt
function spawnRunner() {
  if (document.body.classList.contains('kitties-off')) return;
  const run = document.createElement('div');
  const dur = 10 + Math.random() * 4;
  run.className = 'runner' + (Math.random() < .5 ? ' back' : '');
  run.style.width = (window.innerWidth < 800 ? 80 : 110) + 'px';
  run.style.animationDuration = dur + 's';
  run.innerHTML = '<img src="images/kitty-ballet.jpg" alt="" draggable="false">';
  run.addEventListener('click', () => {
    const r = run.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 12);
    say(r.left + r.width / 2, r.top, 'Bắt được mình rồi! 💖');
    run.remove();
  });
  stickerLayer.appendChild(run);
  setTimeout(() => run.remove(), dur * 1000 + 300);
}
setTimeout(spawnRunner, 3000);
setInterval(spawnRunner, 14000);

// bật / tắt Hello Kitty
const kittyToggle = document.getElementById('kitty-toggle');
kittyToggle.addEventListener('click', () => {
  const off = document.body.classList.toggle('kitties-off');
  kittyToggle.setAttribute('aria-pressed', String(!off));
  kittyToggle.textContent = off ? '🎀 Hiện Kitties' : '🎀 Kitties';
});
