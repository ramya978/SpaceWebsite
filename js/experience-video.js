/* Only visible sections play. Each section has a DIFFERENT video source. */
document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.experience-hero video, .experience-video-section video');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const play = (video) => {
    if (reduced.matches || document.hidden) return;
    video.muted = true;
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') promise.catch(() => {});
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting && !reduced.matches && !document.hidden) play(video);
      else video.pause();
    });
  }, {threshold:0.08});
  videos.forEach(video => {video.muted = true;video.loop = true;observer.observe(video);});
  document.addEventListener('visibilitychange', () => videos.forEach(v => {if(document.hidden)v.pause();else if(v.getBoundingClientRect().bottom > 0 && v.getBoundingClientRect().top < innerHeight)play(v);}));
  reduced.addEventListener('change', () => videos.forEach(v => {if(reduced.matches)v.pause();else if(v.getBoundingClientRect().bottom > 0 && v.getBoundingClientRect().top < innerHeight)play(v);}));
});
