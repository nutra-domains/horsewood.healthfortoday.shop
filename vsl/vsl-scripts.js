/* ===== vturb player loader ===== */
(function () {
  var s = document.createElement("script");
  s.src = "https://scripts.converteai.net/91914cc2-1306-49c8-a61d-c6921573f227/players/6a4eec12f263a8bbe2bdbb5f/v4/player.js";
  s.async = true;
  document.head.appendChild(s);
})();

/* ===== watch counter + buybox reveal ===== */
(function () {
  var el = document.getElementById("watch-count");
  var n = 71744;

  setInterval(function () {
    n += Math.floor(Math.random() * 17) - 7;
    if (n < 69000) n = 69000;
    if (n > 74000) n = 74000;
    if (el) el.textContent = n.toLocaleString("en-US");
  }, 2500);

  // DELAY is in SECONDS (player currentTime is in seconds).
  // Adjust this to match how far into your VSL the offer should appear.
  var DELAY = 2967;

  // Safety fallback: if we never manage to detect the player/time,
  // reveal the buybox anyway after this many milliseconds so the
  // offer never gets stuck hidden forever.
  var FALLBACK_MS = 20 * 60 * 1000; // 20 minutes

  var revealed = false;
  var startedAt = Date.now();

  function findVideo(root) {
    try {
      var v = root.querySelector && root.querySelector("video");
      if (v) return v;
      var all = root.querySelectorAll ? root.querySelectorAll("*") : [];
      for (var i = 0; i < all.length; i++) {
        if (all[i].shadowRoot) {
          var f = findVideo(all[i].shadowRoot);
          if (f) return f;
        }
      }
    } catch (e) {}
    return null;
  }

  function getTime() {
    try {
      var sp = window.smartplayer;
      if (sp && sp.instances && sp.instances.length) {
        var inst = sp.instances[0];
        if (typeof inst.getCurrentTime === "function") {
          var t = inst.getCurrentTime();
          if (typeof t === "number") return t;
        }
        if (inst.video && typeof inst.video.currentTime === "number") {
          return inst.video.currentTime;
        }
        if (typeof inst.currentTime === "number") return inst.currentTime;
      }
    } catch (e) {}

    var v = findVideo(document);
    if (v && typeof v.currentTime === "number") return v.currentTime;
    return null;
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    var b = document.getElementById("buybox");
    if (b) {
      b.style.display = "block";
      b.scrollIntoView({ behavior: "smooth" });
    }
  }

  var iv = setInterval(function () {
    if (revealed) {
      clearInterval(iv);
      return;
    }

    var t = getTime();
    if (t !== null && t >= DELAY) {
      reveal();
      return;
    }

    // safety net: never leave the buybox stuck hidden
    if (Date.now() - startedAt >= FALLBACK_MS) {
      reveal();
    }
  }, 400);
})();
