(function () {
  var images = [];
  var current = 0;
  var startX = 0;
  var startY = 0;
  var savedScrollY = 0;
  var titleTimer;
  var chromeTimer;
  var EDGE_DEAD_ZONE = 30;
  var touchHandled = false;
  var isZooming = false;

  // Zone proportions
  var SIDE_STRIP = 0.25;    // 25% of screen width for left/right nav
  var BOTTOM_STRIP = 0.12;  // bottom 12% of screen height for close
  var TOP_CORNER_H = 0.12;  // top 12% height for corner close
  var TOP_CORNER_W = 0.25;  // right 25% width for corner close

  // Build image list from currently visible gallery items
  function buildImageList() {
    images = [];
    document.querySelectorAll(".column.show a").forEach(function (a) {
      var titleEl = a.closest(".column").querySelector(".text-block");
      images.push({
        src: a.getAttribute("href"),
        title: titleEl ? titleEl.textContent.trim() : ""
      });
    });
  }

  // Create modal elements
  var overlay = document.createElement("div");
  overlay.id = "lb-overlay";

  var img = document.createElement("img");
  img.id = "lb-img";

  var title = document.createElement("div");
  title.id = "lb-title";

  var arrowPrev = document.createElement("div");
  arrowPrev.id = "lb-prev";
  arrowPrev.textContent = "‹";

  var arrowNext = document.createElement("div");
  arrowNext.id = "lb-next";
  arrowNext.textContent = "›";

  var closeBtn = document.createElement("div");
  closeBtn.id = "lb-close";
  closeBtn.textContent = "×";

  overlay.appendChild(img);
  overlay.appendChild(title);
  overlay.appendChild(arrowPrev);
  overlay.appendChild(arrowNext);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  // Show chrome briefly then fade
  function showChrome() {
    arrowPrev.classList.add("visible");
    arrowNext.classList.add("visible");
    closeBtn.classList.add("visible");
    clearTimeout(chromeTimer);
    chromeTimer = setTimeout(function () {
      arrowPrev.classList.remove("visible");
      arrowNext.classList.remove("visible");
      closeBtn.classList.remove("visible");
    }, 2000);
  }

  function hideChrome() {
    clearTimeout(chromeTimer);
    arrowPrev.classList.remove("visible");
    arrowNext.classList.remove("visible");
    closeBtn.classList.remove("visible");
  }

  // Show title briefly then fade
  function showTitle() {
    title.classList.remove("fade-out");
    clearTimeout(titleTimer);
    titleTimer = setTimeout(function () {
      title.classList.add("fade-out");
    }, 2000);
  }

  function hideTitle() {
    clearTimeout(titleTimer);
    title.classList.add("fade-out");
  }

  // Open lightbox
  function open(index, originLink) {
    buildImageList();
    current = index;
    savedScrollY = window.scrollY;
    document.body.style.top = "-" + savedScrollY + "px";
    document.body.classList.add("lb-open");
    if (originLink) originLink.blur();
    show(current);
    requestAnimationFrame(function () {
      overlay.classList.add("active");
    });
  }

  // Close lightbox
  function close() {
    overlay.classList.remove("active");
    hideChrome();
    hideTitle();
    setTimeout(function () {
      document.body.classList.remove("lb-open");
      document.body.style.top = "";
      window.scrollTo(0, savedScrollY);
    }, 300);
  }

  // Show image at index
  function show(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    current = index;
    img.src = images[current].src;
    img.alt = images[current].title;
    title.textContent = images[current].title;
    showTitle();
    showChrome();
  }

  function prev() { show(current - 1); }
  function next() { show(current + 1); }

  // Zone handler — determines action from screen position
  function handleZone(clientX, clientY) {
    var W = window.innerWidth;
    var H = window.innerHeight;

    // Check title tap first (only when visible)
    if (!title.classList.contains("fade-out")) {
      var titleRect = title.getBoundingClientRect();
      if (
        clientX >= titleRect.left && clientX <= titleRect.right &&
        clientY >= titleRect.top && clientY <= titleRect.bottom
      ) {
        hideTitle();
        return;
      }
    }

    // Bottom strip — close
    if (clientY > H * (1 - BOTTOM_STRIP)) {
      close();
      return;
    }

    // Top-right corner — close
    if (clientY < H * TOP_CORNER_H && clientX > W * (1 - TOP_CORNER_W)) {
      close();
      return;
    }

    // Left strip — previous
    if (clientX < W * SIDE_STRIP) {
      prev();
      return;
    }

    // Right strip — next
    if (clientX > W * (1 - SIDE_STRIP)) {
      next();
      return;
    }

    // Center — wake title and chrome
    showTitle();
    showChrome();
  }

  // Click handler — desktop, suppressed after touch
  overlay.addEventListener("click", function (e) {
    if (touchHandled) {
      touchHandled = false;
      return;
    }
    handleZone(e.clientX, e.clientY);
  });

  // Mouse movement reveals relevant chrome
  overlay.addEventListener("mousemove", function (e) {
    var W = window.innerWidth;
    var topZone = window.innerHeight * TOP_CORNER_H;

    if (e.clientY < topZone && e.clientX > W * (1 - TOP_CORNER_W)) {
      closeBtn.classList.add("visible");
      clearTimeout(chromeTimer);
      chromeTimer = setTimeout(function () {
        closeBtn.classList.remove("visible");
      }, 1500);
    }

    if (e.clientX < W * SIDE_STRIP) {
      arrowPrev.classList.add("visible");
      arrowNext.classList.remove("visible");
      clearTimeout(chromeTimer);
      chromeTimer = setTimeout(function () {
        arrowPrev.classList.remove("visible");
      }, 1500);
    } else if (e.clientX > W * (1 - SIDE_STRIP)) {
      arrowNext.classList.add("visible");
      arrowPrev.classList.remove("visible");
      clearTimeout(chromeTimer);
      chromeTimer = setTimeout(function () {
        arrowNext.classList.remove("visible");
      }, 1500);
    } else {
      arrowPrev.classList.remove("visible");
      arrowNext.classList.remove("visible");
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("active")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Touch support
  overlay.addEventListener("touchstart", function (e) {
    if (e.touches.length > 1) {
      isZooming = true;
      return;
    }
    if (isZooming) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  overlay.addEventListener("touchend", function (e) {
    if (e.touches.length > 0) {
      if (e.touches.length === 1) isZooming = true;
      return;
    }

    // All fingers lifted
    if (isZooming) {
      isZooming = false;
      touchHandled = true;
      return;
    }

    var endX = e.changedTouches[0].clientX;
    var endY = e.changedTouches[0].clientY;
    var diffX = startX - endX;
    var diffY = startY - endY;

    touchHandled = true;

    // Swipe down to close — works anywhere on screen, overrides zones
    if (diffY < -60 && Math.abs(diffX) < Math.abs(diffY)) {
      close();
      return;
    }

    // Ignore swipes starting in edge dead zone for horizontal nav
    if (startX < EDGE_DEAD_ZONE || startX > window.innerWidth - EDGE_DEAD_ZONE) return;

    // Horizontal swipe to navigate
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      diffX > 0 ? next() : prev();
      return;
    }

    // Tap — use zone handler
    handleZone(endX, endY);
  });

  // Wire up gallery clicks
  document.addEventListener("click", function (e) {
    var link = e.target.closest(".column.show a");
    if (!link) return;
    e.preventDefault();
    buildImageList();
    var src = link.getAttribute("href");
    var index = images.findIndex(function (im) { return im.src === src; });
    open(index >= 0 ? index : 0, link);
  });

})();
