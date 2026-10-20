const campaigns = window.CREASUNN_CAMPAIGNS;
const campaignOrder = Object.keys(campaigns);
const $ = (selector) => document.querySelector(selector);
const hero = $("#hero");
const motionToggle = $("#motion-toggle");
let activeCampaign = "bebidas";
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let reduceMotion = motionPreference.matches;
const saveData = navigator.connection?.saveData === true;
let autoplay = !reduceMotion && !saveData;
let pointerInside = false;
let rotationTimer;
let particles = [];
const sceneTransition = $("#scene-transition");
const transitionIcons = { bubbles: "◯", embers: "✦", ribbons: "〰", snow: "❄", leaves: "◆", petals: "✿", sun: "☀", spooky: "☾" };
let transitionTimer;
let contentTimer;
let revealTimer;
let blendTimer;
let imageVersion = 0;
const sceneFrame = $(".image-frame");
const scenes = {bebidas:"summer",hogar:"summer",verano:"summer",navidad:"christmas",halloween:"halloween",textil:"neutral",otono:"neutral",primavera:"neutral"};

function setCampaign(key, remember = true, animate = true) {
  animate = animate && !reduceMotion && autoplay;
  const version = ++imageVersion;
  clearTimeout(blendTimer);
  sceneFrame.classList.remove("is-blending", "is-settled");
  if (!campaigns[key]) key = "bebidas";
  clearTimeout(contentTimer);
  clearTimeout(revealTimer);
  hero.classList.remove("is-revealing");
  clearTimeout(transitionTimer);
  sceneTransition.classList.remove("is-active");
  hero.classList.remove("is-changing");
  const data = campaigns[key] || campaigns.bebidas;
  const index = campaignOrder.indexOf(key);
  activeCampaign = key;
  particles = [];
  hero.dataset.effect = data.effect;
  $(".season-glyph").textContent = transitionIcons[data.effect] || "✦";
  document.documentElement.style.setProperty("--campaign", data.color);
  document.documentElement.style.setProperty("--campaign-deep", data.deep);

  const updateContent = () => {
    $("#campaign-kicker").textContent = data.kicker;
    $("#campaign-title").innerHTML = data.title;
    $("#campaign-copy").textContent = data.copy;
    $("#campaign-label").textContent = data.label;
    $("#stage-caption-label").textContent = data.label;
    $("#campaign-use").textContent = data.use;
    $("#campaign-index").textContent = String(index + 1).padStart(2, "0");
    const image = $("#campaign-image");
    const previous = $("#campaign-image-previous");
    previous.srcset = image.srcset;
    previous.sizes = image.sizes;
    previous.src = image.src;
    if (animate) sceneFrame.classList.add("is-blending");
    const imageBase = `assets/scene-${scenes[key] || "neutral"}`;
    image.srcset = `${imageBase}-480.webp 480w, ${imageBase}-960.webp 960w`;
    image.src = `${imageBase}-960.webp`;
    image.alt = `Montaje conceptual de productos promocionales para ${data.label}`;
    image.decode().catch(() => {}).then(() => requestAnimationFrame(() => {
      if (version !== imageVersion) return;
      if (!autoplay || reduceMotion) { sceneFrame.classList.remove("is-blending", "is-settled"); return; }
      sceneFrame.classList.add("is-settled");
      blendTimer = setTimeout(() => sceneFrame.classList.remove("is-blending", "is-settled"), 900);
    }));
    requestAnimationFrame(() => {
      hero.classList.remove("is-changing");
      if (animate && autoplay && !reduceMotion) {
        hero.classList.add("is-revealing");
        revealTimer = setTimeout(() => hero.classList.remove("is-revealing"), 1200);
      }
    });
  };

  updateContent();
  document.querySelectorAll("[data-campaign]").forEach((button) => {
    const selected = button.dataset.campaign === key;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  if (remember) {
    try { localStorage.setItem("creasunn-campaign", key); } catch {}
    const campaignURL = new URL(location.href);
    campaignURL.searchParams.set("campana", key);
    history.replaceState(null, "", campaignURL);
  }
  restartRotation();
}

function restartRotation() {
  clearInterval(rotationTimer);
  const progress = document.querySelector(".campaign-progress span");
  if (progress) {
    progress.style.animation = "none";
    progress.offsetHeight;
    progress.style.animation = "";
  }
  if (!autoplay || document.hidden || pointerInside || hero.contains(document.activeElement) || window.matchMedia("(max-width: 900px)").matches) return;
  rotationTimer = setInterval(() => {
    if (document.hidden || hero.getBoundingClientRect().bottom < 150) return;
    const next = campaignOrder[(campaignOrder.indexOf(activeCampaign) + 1) % campaignOrder.length];
    setCampaign(next, false);
  }, 10000);
}

document.querySelectorAll("[data-campaign]").forEach((button) =>
  button.addEventListener("click", () => setCampaign(button.dataset.campaign))
);

function updateMotionControl() {
  hero.classList.toggle("motion-paused", !autoplay);
  motionToggle.textContent = autoplay ? "Pausar" : "Animar";
  motionToggle.setAttribute("aria-pressed", String(autoplay));
  motionToggle.setAttribute("aria-label", autoplay ? "Pausar animaciones" : "Reanudar animaciones");
  restartRotation();
}
motionToggle.addEventListener("click", () => {
  autoplay = !autoplay;
  if (!autoplay) {
    clearTimeout(blendTimer);
    sceneFrame.classList.remove("is-blending", "is-settled");
    clearTimeout(transitionTimer);
    sceneTransition.classList.remove("is-active");
    hero.classList.remove("is-revealing");
    clearTimeout(revealTimer);
  }
  updateMotionControl();
  syncWorld();
});

hero.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") { pointerInside = true; clearInterval(rotationTimer); } });
hero.addEventListener("pointerleave", () => { pointerInside = false; restartRotation(); });
hero.addEventListener("focusin", () => clearInterval(rotationTimer));
hero.addEventListener("focusout", () => queueMicrotask(restartRotation));

const requested = new URLSearchParams(location.search).get("campana");
let remembered = "bebidas";
try { remembered = localStorage.getItem("creasunn-campaign") || "bebidas"; } catch {}
setCampaign(campaigns[requested] ? requested : remembered, false, false);
updateMotionControl();

// Campaign worlds: one lightweight particle system, four distinct atmospheres.
const canvas = $("#world-canvas");
const ctx = canvas.getContext("2d");
let canvasWidth = 0;
let canvasHeight = 0;
let frameId = 0;
let heroVisible = true;
let lastFrame = 0;

function resizeWorld() {
  const ratio = Math.min(window.devicePixelRatio || 1, innerWidth <= 900 ? 1 : 1.5);
  const rect = hero.getBoundingClientRect();
  if (canvasWidth === rect.width && canvasHeight === rect.height && canvas.width === Math.round(rect.width * ratio)) return;
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  canvas.width = Math.round(canvasWidth * ratio);
  canvas.height = Math.round(canvasHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = [];
}

function createParticle(effect) {
  const base = { x: Math.random() * canvasWidth, y: Math.random() * canvasHeight, phase: Math.random() * Math.PI * 2, depth: .35 + Math.random() * .65 };
  if (effect === "snow") return { ...base, y: -20, r: 1.5 + Math.random() * 4, speed: .6 + Math.random() * 1.8, drift: .3 + Math.random() * .8, alpha: .4 + Math.random() * .6 };
  if (effect === "bubbles") return { ...base, y: canvasHeight + 20, r: 5 + Math.random() * 18, speed: .25 + Math.random() * .75, alpha: .12 + Math.random() * .22 };
  if (effect === "embers") return { ...base, y: canvasHeight + 10, r: 1 + Math.random() * 3, speed: .25 + Math.random() * 1.1, alpha: .25 + Math.random() * .55 };
  if (effect === "leaves") return { ...base, y: -25, r: 5 + Math.random() * 9, speed: .45 + Math.random() * 1.2, drift: .5 + Math.random() * 1.4, spin: Math.random() * .08, hue: Math.random() > .5 ? "#b9502d" : "#e9a23b" };
  if (effect === "petals") return { ...base, y: -20, r: 4 + Math.random() * 8, speed: .35 + Math.random() * .9, drift: .8 + Math.random() * 1.5, spin: Math.random() * .06, hue: Math.random() > .5 ? "#f48fb1" : "#fff4f7" };
  if (effect === "sun") return { ...base, y: Math.random() * canvasHeight, r: 1 + Math.random() * 3, speed: .2 + Math.random() * .5, alpha: .2 + Math.random() * .55 };
  if (effect === "spooky") return { ...base, y: canvasHeight + 30, r: 12 + Math.random() * 32, speed: .12 + Math.random() * .45, alpha: .05 + Math.random() * .12, bat: Math.random() > .65 };
  return { ...base, y: canvasHeight + 30, w: 2 + Math.random() * 4, len: 22 + Math.random() * 55, speed: .35 + Math.random() * .8, alpha: .12 + Math.random() * .28 };
}

function syncWorld() {
  cancelAnimationFrame(frameId);
  const running = !!ctx && !reduceMotion && autoplay && heroVisible && !document.hidden;
  hero.classList.toggle("motion-idle", !running);
  if (running) { lastFrame = 0; frameId = requestAnimationFrame(drawWorld); }
  else if (ctx && (reduceMotion || !autoplay)) ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawWorld(now) {
  frameId = requestAnimationFrame(drawWorld);
  if (now - lastFrame < 1000 / 30) return;
  const dt = lastFrame ? Math.min((now - lastFrame) / (1000 / 30), 2) : 1;
  lastFrame = now;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const effect = campaigns[activeCampaign].effect;
  const desktopCount = effect === "snow" ? 105 : effect === "bubbles" ? 28 : effect === "sun" ? 65 : effect === "spooky" ? 24 : 44;
  const target = Math.round(desktopCount * (innerWidth <= 900 ? .4 : 1));
  while (particles.length < target) particles.push({ ...createParticle(effect), y: Math.random() * canvasHeight });
  if (particles.length > target) particles.length = target;

  particles.forEach((p) => {
    p.phase += .018 * dt;
    if (p.x > canvasWidth + 60) p.x = -60;
    if (p.x < -60) p.x = canvasWidth + 60;
    if (effect === "snow") {
      p.y += p.speed * dt * (1 + p.depth); p.x += (Math.sin(p.phase) * p.drift + Math.sin(now / 2800) * 1.2) * dt;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.phase * .3); ctx.globalAlpha=p.alpha;
      ctx.fillStyle="#fff";ctx.strokeStyle="#e5f7ff";ctx.lineWidth=.8;
      if (p.r > 4) { for(let arm=0;arm<6;arm++){ctx.rotate(Math.PI/3);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(p.r*1.6,0);ctx.moveTo(p.r*.8,0);ctx.lineTo(p.r*.45,-p.r*.35);ctx.moveTo(p.r*.8,0);ctx.lineTo(p.r*.45,p.r*.35);ctx.stroke();} }
      else {ctx.beginPath();ctx.arc(0,0,p.r*p.depth,0,Math.PI*2);ctx.fill();}ctx.restore();
      if (p.y > canvasHeight + 15) Object.assign(p, createParticle(effect));
    } else if (effect === "bubbles") {
      p.y -= p.speed * dt; p.x += Math.sin(p.phase) * .35 * dt;
      ctx.beginPath(); ctx.strokeStyle = `rgba(255,255,255,${p.alpha})`; ctx.lineWidth = 1.2; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();ctx.strokeStyle=`rgba(186,246,255,${p.alpha*1.7})`;ctx.arc(p.x,p.y,p.r*.72,Math.PI,Math.PI*1.5);ctx.stroke();
      if (p.y < -30) Object.assign(p, createParticle(effect));
    } else if (effect === "embers") {
      p.y -= p.speed * dt * 1.8; p.x += Math.sin(p.phase) * .55 * dt;
      ctx.shadowBlur = 9; ctx.shadowColor = "#ffcf75"; ctx.beginPath(); ctx.fillStyle = `rgba(255,220,132,${p.alpha})`; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      if (p.y < -15) Object.assign(p, createParticle(effect));
    } else if (effect === "leaves" || effect === "petals") {
      p.y += p.speed * dt; p.x += (Math.sin(p.phase) * p.drift + Math.sin(now/3200)*1.4) * dt; p.phase += p.spin * dt;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.phase);ctx.scale(1,.35+Math.abs(Math.cos(p.phase*.7))*.65); ctx.fillStyle = p.hue; ctx.globalAlpha = .4 + p.depth*.5;
      ctx.beginPath();
      if(effect === "leaves") {ctx.moveTo(-p.r,0);ctx.lineTo(-p.r*.4,-p.r*.35);ctx.lineTo(-p.r*.6,-p.r*.75);ctx.lineTo(0,-p.r*.5);ctx.lineTo(p.r*.5,-p.r);ctx.lineTo(p.r*.6,-p.r*.3);ctx.lineTo(p.r,0);ctx.lineTo(p.r*.5,p.r*.25);ctx.lineTo(p.r*.3,p.r*.8);ctx.lineTo(-p.r*.1,p.r*.5);ctx.closePath();}
      else {ctx.moveTo(-p.r,0);ctx.bezierCurveTo(-p.r,-p.r,p.r,-p.r,p.r*.8,0);ctx.bezierCurveTo(p.r*.4,p.r*.8,-p.r*.4,p.r*.5,-p.r,0);}
      ctx.fill();
      if(effect === "leaves"){ctx.beginPath();ctx.strokeStyle="rgba(80,35,10,.45)";ctx.moveTo(-p.r,0);ctx.lineTo(p.r*.7,0);ctx.stroke();}ctx.restore();
      if (p.y > canvasHeight + 30) Object.assign(p, createParticle(effect));
    } else if (effect === "sun") {
      p.x += p.speed * dt; p.y += Math.sin(p.phase) * .18 * dt;
      const glow = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5); glow.addColorStop(0,`rgba(255,255,255,${p.alpha})`); glow.addColorStop(1,"rgba(255,214,81,0)");
      ctx.fillStyle=glow; ctx.fillRect(p.x-p.r*5,p.y-p.r*5,p.r*10,p.r*10);
      if (p.x > canvasWidth + 20) Object.assign(p, createParticle(effect), {x:-20});
    } else if (effect === "spooky") {
      p.y -= p.speed * dt; p.x += (p.bat ? 1.1 + p.depth : Math.sin(p.phase) * .4) * dt;
      if (p.bat) { const wing=Math.sin(p.phase*8)*.6;ctx.save();ctx.translate(p.x,p.y+Math.sin(p.phase)*15);ctx.scale(.7+p.depth,.7+p.depth);ctx.fillStyle="rgba(190,163,211,.6)";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-8,-12*wing,-19,-6);ctx.quadraticCurveTo(-14,4,-10,4);ctx.quadraticCurveTo(-6,0,-2,5);ctx.lineTo(0,9);ctx.lineTo(2,5);ctx.quadraticCurveTo(6,0,10,4);ctx.quadraticCurveTo(14,4,19,-6);ctx.quadraticCurveTo(8,-12*wing,0,0);ctx.fill();ctx.restore(); }
      else { const fog=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r); fog.addColorStop(0,`rgba(223,205,237,${p.alpha})`); fog.addColorStop(1,"rgba(84,43,105,0)"); ctx.fillStyle=fog; ctx.fillRect(p.x-p.r,p.y-p.r,p.r*2,p.r*2); }
      if (p.y < -50) Object.assign(p, createParticle(effect));
    } else {
      p.y -= p.speed * dt; p.x += Math.sin(p.phase) * .8 * dt;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(p.phase) * .5); ctx.strokeStyle = `rgba(255,255,255,${p.alpha})`; ctx.lineWidth = p.w; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(14, -p.len*.3, -12, -p.len*.7, 0, -p.len); ctx.stroke(); ctx.restore();
      if (p.y < -80) Object.assign(p, createParticle(effect));
    }
  });
}

const imageFrame = document.querySelector(".image-frame");
hero.addEventListener("pointermove", (event) => {
  if (reduceMotion || !autoplay || innerWidth < 900) return;
  const rect = hero.getBoundingClientRect();
  const rx = ((event.clientY - rect.top) / rect.height - .5) * -7;
  const ry = ((event.clientX - rect.left) / rect.width - .5) * 8;
  imageFrame.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
});
hero.addEventListener("pointerleave", () => { imageFrame.style.transform = "rotateX(0) rotateY(0)"; });
new ResizeObserver(() => { if (ctx) resizeWorld(); restartRotation(); }).observe(hero);
new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; syncWorld(); }, {threshold:0}).observe(hero);
document.addEventListener("visibilitychange", () => { syncWorld(); restartRotation(); });
motionPreference.addEventListener("change", () => {
  clearTimeout(blendTimer);
  sceneFrame.classList.remove("is-blending", "is-settled");
  reduceMotion = motionPreference.matches;
  autoplay = !reduceMotion && !saveData;
  updateMotionControl();
  syncWorld();
});
if (ctx) resizeWorld();
syncWorld();

// One-time section entrances; content remains visible if scripts or motion are disabled.
const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    sectionObserver.unobserve(entry.target);
    if (!reduceMotion && !saveData && autoplay) {
      entry.target.animate(
        [{opacity:.35,transform:"translateY(22px)"},{opacity:1,transform:"translateY(0)"}],
        {duration:650,easing:"cubic-bezier(.16,1,.3,1)"}
      );
    }
  }
}, {threshold:.12});
document.querySelectorAll(".manifesto-intro,.manifesto-detail,.section-heading,.category-card,.steps article,.closing-invitation h2").forEach(el => sectionObserver.observe(el));
