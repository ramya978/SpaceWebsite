/* Clean-URL service worker for SPACE 1.
   When the browser asks for a page without ".html" (reload, back/forward,
   typed or shared link like /learning-academy), this answers with
   /learning-academy.html, so the server never shows "Cannot GET".
   Nothing is cached: every page is always fetched fresh from the server. */

self.addEventListener("install", function () {
  self.skipWaiting(); // start working immediately
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim()); // control already-open tabs
});

self.addEventListener("fetch", function (event) {
  var req = event.request;

  // Only page loads (not images, css, js, API calls)
  if (req.mode !== "navigate" || req.method !== "GET") return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  var path = url.pathname.replace(/\/+$/, "");    // /about/ -> /about
  var lastPart = path.split("/").pop();
  if (!lastPart) return;                           // "/" -> server serves index.html
  if (/\.[a-z0-9]+$/i.test(lastPart)) return;      // already has .html / .php / .pdf etc.

  var htmlUrl = url.origin + path + ".html" + url.search;

  event.respondWith(
    fetch(htmlUrl, { credentials: "same-origin" })
      .then(function (res) {
        // Use the .html page if it exists; otherwise let the server answer normally
        if (res.ok && !res.redirected) return res;
        return fetch(req);
      })
      .catch(function () {
        return fetch(req);
      })
  );
});