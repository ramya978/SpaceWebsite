
document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll(".lazy-video");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target: video, isIntersecting }) => {
      if (isIntersecting) {
        // Load only once
        if (!video.dataset.loaded) {
          const source = document.createElement("source");
          source.src = video.dataset.video;
          source.type = "video/mp4";

          video.appendChild(source);
          video.dataset.loaded = "true";
          video.load();
        }

        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, {
    rootMargin: "300px 0px",
    threshold: 0.01
  });

  videos.forEach(video => observer.observe(video));
});
