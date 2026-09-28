(() => {
  const section = document.querySelector('.scroll-opening');
  const video = document.querySelector('#construction-scrub');
  const bar = section.querySelector('.scrub-track span');
  const label = document.querySelector('#scrub-percent');
  const hint = document.querySelector('#scrub-hint');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0, target = 0, smooth = 0, last = 0, ready = Number.isFinite(video.duration);
  const disabled = () => reduced.matches || document.body.classList.contains('motion-paused');
  // Match the source's 24 fps: seek only when the requested visible frame changes.
  const frameTime = () => Math.min(Math.max(0, video.duration - .04), Math.floor(smooth * Math.max(0, video.duration - .04) * 24) / 24 + .001);
  // CSS sticky provides pinning even when the external animation libraries are unavailable.
  function measure() {
    const rect = section.getBoundingClientRect();
    const distance = Math.max(1, section.offsetHeight - innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / distance));
    // End early enough to settle on the final frame before the sticky scene releases.
    target = Math.min(1, progress / .92);
    const entrance = Math.min(1, Math.max(0, (progress - .04) / .14));
    const exit = Math.min(1, Math.max(0, (.86 - progress) / .17));
    const visibility = disabled() ? 1 : entrance * exit;
    section.style.setProperty('--title-opacity', visibility.toFixed(3));
    section.style.setProperty('--title-offset', `${(1 - visibility) * 32}px`);
    const active = rect.bottom > innerHeight * .55;
    if (document.body.classList.contains('opening-active') !== active) document.body.classList.toggle('opening-active', active);
    if (!disabled() && !document.hidden && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }
  function tick(now) {
    raf = 0;
    if (disabled() || document.hidden) return;
    const delta = Math.min(64, now - last); last = now;
    smooth += (target - smooth) * (1 - Math.exp(-delta / 140));
    if (Math.abs(target - smooth) < .0005) smooth = target;
    bar.style.transform = `scaleX(${smooth})`;
    label.textContent = `${String(Math.round(smooth * 100)).padStart(2, '0')} / 100`;
    hint.textContent = smooth > .995 ? 'BUILT. KEEP EXPLORING ↓' : 'SCROLL TO BUILD';
    if (ready && !video.seeking) {
      const time = frameTime();
      if (Math.abs(video.currentTime - time) > .02) video.currentTime = time;
    }
    if (smooth !== target) raf = requestAnimationFrame(tick);
  }
  function sync() {
    section.classList.toggle('is-static', disabled());
    video.pause();
    if (disabled()) { cancelAnimationFrame(raf); raf = 0; hint.textContent = 'EXPLORE THE PORTFOLIO ↓'; }
    measure();
  }
  video.addEventListener('loadedmetadata', () => { ready = Number.isFinite(video.duration); measure(); });
  video.addEventListener('seeked', () => {
    if (!disabled() && ready && !raf && Math.abs(video.currentTime - frameTime()) > .02) {
      last = performance.now(); raf = requestAnimationFrame(tick);
    }
  });
  video.addEventListener('play', () => video.pause());
  video.addEventListener('error', () => { section.classList.add('is-static'); section.querySelector('.scrub-error').hidden = false; });
  addEventListener('scroll', measure, {passive:true});
  addEventListener('resize', measure, {passive:true});
  document.addEventListener('visibilitychange', measure);
  reduced.addEventListener('change', sync);
  let wasPaused = disabled();
  new MutationObserver(() => { const paused = disabled(); if (paused !== wasPaused) { wasPaused = paused; sync(); } }).observe(document.body, {attributes:true, attributeFilter:['class']});
  sync();
})();
