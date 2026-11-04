/* ==========================================
   EXPLORE THE UNIVERSE - MOBILE IMAGE SLIDER
   Swipe, prev/next buttons, dots, autoplay.
   Active only at max-width: 760px.
========================================== */
(function () {
  var slider = document.querySelector(".universe-slider");
  if (!slider) return;

  var track = slider.querySelector(".tile-grid");
  var slides = Array.prototype.slice.call(track.querySelectorAll(".tile"));
  var dotsWrap = slider.querySelector(".universe-slider-dots");
  var prevBtn = slider.querySelector('[data-slide="prev"]');
  var nextBtn = slider.querySelector('[data-slide="next"]');
  if (!slides.length) return;

  var mobile = window.matchMedia("(max-width: 760px)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var AUTOPLAY_DELAY = 4500;
  var RESUME_DELAY = 6000;

  var current = 0;
  var timer = null;
  var resumeTimer = null;
  var inView = false;
  var ticking = false;
  var dots = [];

  /* ---------- Build dots ---------- */
  slides.forEach(function (slide, i) {
    var title = slide.querySelector("h3");
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "universe-slider-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute(
      "aria-label",
      "Slide " + (i + 1) + (title ? ": " + title.textContent.trim() : "")
    );
    dot.addEventListener("click", function () {
      userInteracted();
      goTo(i);
    });
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  /* ---------- Accessibility attributes ---------- */
  function setA11y(on) {
    if (on) {
      track.setAttribute("role", "region");
      track.setAttribute("aria-roledescription", "carousel");
      track.setAttribute("aria-label", "Explore the Universe");
      track.setAttribute("tabindex", "0");
      slides.forEach(function (slide, i) {
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", i + 1 + " of " + slides.length);
      });
    } else {
      ["role", "aria-roledescription", "aria-label", "tabindex"].forEach(function (a) {
        track.removeAttribute(a);
      });
      slides.forEach(function (slide) {
        slide.removeAttribute("aria-roledescription");
        slide.removeAttribute("aria-label");
        slide.classList.remove("is-active");
      });
    }
  }

  /* ---------- Navigation ---------- */
  function goTo(index) {
    var n = slides.length;
    index = ((index % n) + n) % n;
    var slide = slides[index];
    var left = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
    track.scrollTo({
      left: Math.max(0, left),
      behavior: reduceMotion.matches ? "auto" : "smooth"
    });
  }

  function setActive(index) {
    current = index;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach(function (dot, i) {
      var on = i === index;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  /* Find the slide closest to the track centre */
  function updateFromScroll() {
    ticking = false;
    var box = track.getBoundingClientRect();
    var centre = box.left + box.width / 2;
    var best = 0;
    var bestDist = Infinity;
    slides.forEach(function (slide, i) {
      var r = slide.getBoundingClientRect();
      var dist = Math.abs(r.left + r.width / 2 - centre);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    if (best !== current || !slides[best].classList.contains("is-active")) {
      setActive(best);
    }
  }

  track.addEventListener(
    "scroll",
    function () {
      if (!mobile.matches || ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateFromScroll);
    },
    { passive: true }
  );

  prevBtn.addEventListener("click", function () {
    userInteracted();
    goTo(current - 1);
  });

  nextBtn.addEventListener("click", function () {
    userInteracted();
    goTo(current + 1);
  });

  track.addEventListener("keydown", function (e) {
    if (!mobile.matches) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      userInteracted();
      goTo(current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      userInteracted();
      goTo(current - 1);
    }
  });

  /* ---------- Autoplay ---------- */
  function canAutoplay() {
    return mobile.matches && !reduceMotion.matches && inView && !document.hidden;
  }

  function start() {
    stop();
    if (!canAutoplay()) return;
    timer = window.setInterval(function () {
      goTo(current + 1);
    }, AUTOPLAY_DELAY);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  /* Pause while the user swipes or taps, resume after a short idle */
  function userInteracted() {
    stop();
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(start, RESUME_DELAY);
  }

  track.addEventListener("touchstart", userInteracted, { passive: true });
  track.addEventListener("pointerdown", userInteracted);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", function () {
    userInteracted();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0.4 }
    ).observe(slider);
  } else {
    inView = true;
  }

  /* ---------- Mobile / desktop switch ---------- */
  function onModeChange() {
    if (mobile.matches) {
      setA11y(true);
      setActive(0);
      track.scrollLeft = 0;
      start();
    } else {
      stop();
      setA11y(false);
    }
  }

  if (mobile.addEventListener) {
    mobile.addEventListener("change", onModeChange);
  } else if (mobile.addListener) {
    mobile.addListener(onModeChange);
  }

  onModeChange();
})();