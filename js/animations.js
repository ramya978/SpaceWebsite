/* Animations and small interactive effects.
   Each block below is independent. Delete a block to remove that effect.
   Timings and distances are in css/theme.css. */

(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = document.querySelector(".hero");

  // ---- 1. Hero: split the headline into words, then play the intro ----
  if (hero) {
    var title = hero.querySelector("h1");
    var words = title.textContent.trim().split(/\s+/);
    title.setAttribute("aria-label", title.textContent.trim());
    title.innerHTML = words
      .map(function (word, i) {
        return '<span class="word" aria-hidden="true"><span style="--w:' + i + '">' + word + "</span></span>";
      })
      .join(" ");

    // Wait two frames so the browser paints the hidden state first
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add("is-ready"); });
    });
  }

  // ---- 2. Reveal elements as they scroll into view ----
  var revealTargets = [];
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--delay", Math.min(i, 8) * 80 + "ms");
      revealTargets.push(child);
    });
  });
  document.querySelectorAll("[data-reveal]").forEach(function (el) { revealTargets.push(el); });

  function countUp(el) {
    var match = el.dataset.count.match(/^(\D*)([\d,.]+)(.*)$/);
    if (!match || reduceMotion) { el.textContent = el.dataset.count; return; }
    var target = parseFloat(match[2].replace(/,/g, ""));
    var decimals = (match[2].split(".")[1] || "").length;
    var start = performance.now();
    var duration = 1600;
    (function tick(now) {
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 4);
      var value = (target * eased).toFixed(decimals);
      el.textContent = match[1] + Number(value).toLocaleString("en-US", { minimumFractionDigits: decimals }) + match[3];
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        entry.target.querySelectorAll("[data-count]").forEach(countUp);
        if (entry.target.dataset.count) countUp(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
    document.querySelectorAll(".timeline").forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-in"); });
  }

  // ---- 3. Header: solid background, hide while scrolling down, progress bar ----
  var header = document.getElementById("header");
  var progress = document.getElementById("progress");
  var heroMedia = document.querySelector(".hero-media");
  var lastY = window.scrollY;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-solid", y > 40);
    header.classList.toggle("is-hidden", y > lastY && y > 300 && !document.getElementById("menu").classList.contains("is-open"));
    lastY = y;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    // Parallax: the hero picture moves slower than the page
    if (heroMedia && !reduceMotion && y < window.innerHeight * 1.2) {
      heroMedia.style.transform = "translate3d(0," + y * 0.28 + "px,0)";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- 4. Glow on cards that follows the mouse ----
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var box = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - box.left + "px");
      card.style.setProperty("--my", e.clientY - box.top + "px");
    });
  });

  // ---- 5. Image tiles tilt towards the mouse ----
  if (!reduceMotion) {
    document.querySelectorAll(".tile").forEach(function (tile) {
      tile.addEventListener("mousemove", function (e) {
        var box = tile.getBoundingClientRect();
        var x = (e.clientX - box.left) / box.width - 0.5;
        var y = (e.clientY - box.top) / box.height - 0.5;
        tile.style.transform = "perspective(900px) rotateY(" + x * 7 + "deg) rotateX(" + -y * 7 + "deg) translateZ(0)";
      });
      tile.addEventListener("mouseleave", function () { tile.style.transform = ""; });
    });

    // ---- 6. Buttons lean slightly towards the cursor ----
    document.querySelectorAll(".hero-buttons .btn, .cta-band .btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var box = btn.getBoundingClientRect();
        var x = e.clientX - (box.left + box.width / 2);
        var y = e.clientY - (box.top + box.height / 2);
        btn.style.transform = "translate(" + x * 0.18 + "px," + y * 0.28 + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  // ---- 7. Twinkling star field over each hero picture ----
  if (hero) {
    // var canvas = document.createElement("canvas");
    // canvas.className = "starfield";
    // hero.insertBefore(canvas, hero.firstChild);
    // var ctx = canvas.getContext("2d");
    // var stars = [];
    // var mouse = { x: 0, y: 0 };
    // var visible = true;

    // function sizeCanvas() {
    //   var ratio = Math.min(window.devicePixelRatio || 1, 2);
    //   canvas.width = hero.clientWidth * ratio;
    //   canvas.height = hero.clientHeight * ratio;
    //   ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    //   stars = [];
    //   var count = Math.round(hero.clientWidth / 9);
    //   for (var i = 0; i < count; i++) {
    //     stars.push({
    //       x: Math.random() * hero.clientWidth,
    //       y: Math.random() * hero.clientHeight,
    //       size: Math.random() * 1.3 + 0.3,
    //       depth: Math.random() * 0.9 + 0.1,
    //       phase: Math.random() * Math.PI * 2,
    //       speed: Math.random() * 1.6 + 0.4
    //     });
    //   }
    // }

    // function draw(time) {
    //   ctx.clearRect(0, 0, hero.clientWidth, hero.clientHeight);
    //   stars.forEach(function (s) {
    //     var alpha = reduceMotion ? 0.6 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time / 1000 * s.speed + s.phase));
    //     var x = s.x + mouse.x * s.depth * 18;
    //     var y = s.y + mouse.y * s.depth * 12;
    //     ctx.fillStyle = "rgba(255,255,255," + alpha.toFixed(2) + ")";
    //     ctx.beginPath();
    //     ctx.arc(x, y, s.size, 0, Math.PI * 2);
    //     ctx.fill();
    //   });
    //   if (visible && !reduceMotion) requestAnimationFrame(draw);
    // }

    // hero.addEventListener("mousemove", function (e) {
    //   var box = hero.getBoundingClientRect();
    //   mouse.x = (e.clientX - box.left) / box.width - 0.5;
    //   mouse.y = (e.clientY - box.top) / box.height - 0.5;
    // });
    // window.addEventListener("resize", sizeCanvas);
    // sizeCanvas();
    // requestAnimationFrame(draw);

    // // Stop drawing when the hero is off screen
    // if ("IntersectionObserver" in window) {
    //   new IntersectionObserver(function (entries) {
    //     var wasVisible = visible;
    //     visible = entries[0].isIntersecting;
    //     if (visible && !wasVisible) requestAnimationFrame(draw);
    //   }).observe(hero);
    // }
  }

  // ---- 8. In-page links scroll smoothly without changing the address ----
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });

  // ---- 9. Fade the page out before moving to another page ----
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href]");
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || link.target === "_blank") return;
    var href = link.getAttribute("href");
    if (!/\.html$/.test(href)) return;
    e.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(function () { window.location.href = href; }, 320);
  });
  window.addEventListener("pageshow", function () { document.body.classList.remove("is-leaving"); });
})();
