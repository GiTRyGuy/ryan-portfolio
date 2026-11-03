// Ryan Lussing portfolio: phone menu, project grid and click-to-load video player.

/* Phone menu ---------------------------------------------------------------- */
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  siteNav.classList.toggle('is-open', open);
}

menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
siteNav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

/* Video modal ----------------------------------------------------------------
   The player iframe is only created when someone clicks, and removed on close,
   so no YouTube/Vimeo code loads until a video is actually played. */
const modal = document.getElementById('videoModal');
const modalTitle = document.getElementById('modalTitle');
const modalPlayer = document.getElementById('modalPlayer');
const closeBtn = document.getElementById('closeModal');
let lastFocus = null;

// Turn a YouTube or Vimeo page/share URL into an embed URL, or null if unsupported.
function toEmbedUrl(url) {
  let u;
  // Accept links pasted without https://, e.g. "youtube.com/watch?v=…"
  try { u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`); } catch { return null; }
  const host = u.hostname.replace(/^(www|m)\./, '');

  if (host === 'youtu.be' || host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const id = host === 'youtu.be'
      ? u.pathname.slice(1)
      : u.searchParams.get('v') || (u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/) || [])[1];
    if (!id) return null;
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`;
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    // Unlisted Vimeo links carry a privacy hash: vimeo.com/123/abc or ?h=abc
    const m = u.pathname.match(/\/(\d+)(?:\/([\da-f]+))?/);
    if (!m) return null;
    const hash = m[2] || u.searchParams.get('h');
    return `https://player.vimeo.com/video/${m[1]}?autoplay=1${hash ? `&h=${hash}` : ''}`;
  }

  return null;
}

function openVideo(embedUrl, title) {
  lastFocus = document.activeElement;
  modalTitle.textContent = title;
  const frame = document.createElement('iframe');
  frame.src = embedUrl;
  frame.title = title;
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  modalPlayer.replaceChildren(frame);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  closeBtn.focus();
}

function closeVideo() {
  if (!modal.classList.contains('open')) return;
  modalPlayer.replaceChildren(); // removing the iframe stops playback
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocus) lastFocus.focus();
}

closeBtn.addEventListener('click', closeVideo);
modal.addEventListener('click', (e) => { if (e.target === modal) closeVideo(); });
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closeVideo();
  setMenu(false);
});
// Keep keyboard focus inside the modal while it's open
document.addEventListener('focusin', (e) => {
  if (modal.classList.contains('open') && !modal.contains(e.target)) closeBtn.focus();
});

/* Project grid (data/projects.json) ------------------------------------------ */
const projectGrid = document.getElementById('projectGrid');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// Descriptions may wrap titles in *asterisks* to italicise them.
function appendRichText(parent, text) {
  text.split(/\*([^*]+)\*/).forEach((part, i) => {
    if (!part) return;
    parent.append(i % 2 ? el('em', '', part) : part);
  });
}

function renderThumb(project) {
  const thumb = el('div', 'thumb');
  const chips = (project.tags || []).map((tag) => el('span', 'chip', tag));

  if (project.thumbnail) {
    const img = el('img');
    img.src = project.thumbnail;
    img.alt = project.thumbnailAlt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    const chipline = el('div', 'chipline');
    chipline.append(...chips);
    const overlay = el('div', 'overlay');
    overlay.append(chipline);
    thumb.append(img, overlay);
  } else if (project.textThumbnail) {
    const art = el('div', 'text-thumb');
    const meta = el('div', 'meta');
    meta.append(...chips);
    art.append(
      el('div', 'brand', project.textThumbnail.brand),
      el('div', 'name', project.textThumbnail.headline),
      el('div', 'text-thumb-lines'),
      meta,
    );
    thumb.append(art);
  }
  return thumb;
}

function renderActions(project) {
  const actions = [];

  for (const video of project.videos || []) {
    if (!video.url) continue;
    const embedUrl = toEmbedUrl(video.url);
    if (!embedUrl) {
      console.warn(`projects.json: "${project.title}" has a video url that isn't a YouTube or Vimeo link: ${video.url}`);
      continue;
    }
    const btn = el('button', 'button', video.label || 'Play video');
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.addEventListener('click', () => openVideo(embedUrl, video.title || project.title));
    actions.push(btn);
  }

  for (const link of project.links || []) {
    const a = el('a', 'button', `${link.label} ↗`);
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    actions.push(a);
  }

  if (!actions.length) return null;
  const wrap = el('div', 'actions');
  wrap.append(...actions);
  return wrap;
}

function renderProject(project) {
  const heading = el('div');
  heading.append(el('div', 'role', project.role), el('h3', '', project.title));
  const title = el('div', 'card-title');
  title.append(heading);

  const description = el('p');
  appendRichText(description, project.description || '');

  const body = el('div', 'card-body');
  body.append(title, description);
  const actions = renderActions(project);
  if (actions) body.append(actions);

  const card = el('article', 'card');
  card.append(renderThumb(project), body);
  return card;
}

async function loadProjects() {
  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    projectGrid.append(...projects.map(renderProject));
  } catch (err) {
    console.error('Could not load data/projects.json. Preview the site through a local server, not file://.', err);
  }
}

loadProjects();
