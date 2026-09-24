(() => {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-paused');
  const chapterLinks = [...document.querySelectorAll('.chapter-nav a')];
  const progress = document.querySelector('.chapter-progress span');
  let queued = false;
  function updateChapter() {
    queued = false;
    let active = chapterLinks[0];
    chapterLinks.forEach(link => { if (document.querySelector(link.hash).getBoundingClientRect().top < innerHeight * .5) active = link; });
    chapterLinks.forEach(link => { if (link === active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
    progress.style.width = `${100 * scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)}%`;
  }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateChapter); } }, {passive:true});
  updateChapter();
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); } }), {threshold:.08});
  if (!reduced()) document.querySelectorAll('.flagship,.project-card,.profile-layout,.contact-heading').forEach(element => { element.classList.add('scroll-reveal','pending'); observer.observe(element); });
})();
