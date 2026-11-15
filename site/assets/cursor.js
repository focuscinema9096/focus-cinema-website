/**
 * Focus Cinema - Custom Viewfinder Cursor
 * Active only on devices with a fine pointer (mouse/trackpad).
 * Honors prefers-reduced-motion and touch devices.
 */
(function () {
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || motion.matches) return;

  function initCursor() {
    var root = document.documentElement;
    var frame = document.getElementById("fc-frame");
    var dot = document.getElementById("fc-dot");
    if (!frame || !dot) return;

    var FRAME_EASE = 0.16;   // lower = brackets trail further behind the dot
    var DOT_EASE   = 0.55;   // higher = dot sticks closer to the real pointer
    var CLICKABLE  = 'a, button, [role="button"], summary, label[for], select, input[type="submit"], input[type="button"], ' +
                     '[data-cursor], .video-thumb, .package-card, .pv, .thumb1, .thumb2, .thumb3, .card, .reel-frame';

    var mx = -100, my = -100;      // real pointer
    var fx = mx, fy = my;          // frame position
    var dx = mx, dy = my;          // dot position
    var raf = null, shown = false;

    root.classList.add("fc-cursor-on");

    function loop() {
      fx += (mx - fx) * FRAME_EASE;  fy += (my - fy) * FRAME_EASE;
      dx += (mx - dx) * DOT_EASE;    dy += (my - dy) * DOT_EASE;
      frame.style.transform = "translate3d(" + fx.toFixed(2) + "px," + fy.toFixed(2) + "px,0)";
      dot.style.transform   = "translate3d(" + dx.toFixed(2) + "px," + dy.toFixed(2) + "px,0)";
      if (Math.abs(mx - fx) + Math.abs(my - fy) + Math.abs(mx - dx) + Math.abs(my - dy) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else { raf = null; }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!shown) { fx = dx = mx; fy = dy = my; shown = true; root.classList.add("fc-visible"); }
      var t = e.target && e.target.closest ? e.target.closest(CLICKABLE) : null;
      root.classList.toggle("fc-link", !!t);
      kick();
    }, { passive: true });

    window.addEventListener("mousedown", function () { root.classList.add("fc-down"); });
    window.addEventListener("mouseup",   function () { setTimeout(function () { root.classList.remove("fc-down"); }, 90); });

    document.addEventListener("mouseleave", function () { root.classList.remove("fc-visible"); shown = false; });
    document.addEventListener("mouseenter", function () { });

    var onChange = function () {
      if (!fine.matches || motion.matches) {
        root.classList.remove("fc-cursor-on", "fc-visible");
        frame.style.display = dot.style.display = "none";
      }
    };
    if (fine.addEventListener) fine.addEventListener("change", onChange);
    if (motion.addEventListener) motion.addEventListener("change", onChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCursor);
  } else {
    initCursor();
  }
})();
