(() => {
  const gallery = document.querySelector('.bubble-gallery');
  if (!gallery) return;
  new IntersectionObserver(entries => {
    gallery.classList.toggle('in-view', entries[0].isIntersecting);
  }).observe(gallery);
})();
