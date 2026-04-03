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
    // Trigger fade in on next frame so transition fires
    requestAnimationFrame(function () {
      overlay.classList.add("active");
    });
  }

  // Close lightbox
  function close() {
    overlay.classList.remove("active");
    hideChrome();
    hideTitle();
    // Wait for fade out transition before hiding
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

  // Screen-relative zone handler
  function handleZone(clientX, clientY) {
    var third = window.innerWidth / 3;

    // Check if tap is on title
    var titleRect = title.getBoundingClientRect();
    if (
      clientX >= titleRect.left &&
      clientX <= titleRect.right &&
      clientY >= titleRect.top &&
      clientY <= titleRect.bottom &&
      !title.classList.contains("fade-out")
    ) {
      hideTitle();
      return;
    }

    // Check if tap is on close button
    var closeRect = closeBtn.getBoundingClientRect();
    if (
      clientX >= closeRect.left &&
      clientX <= closeRect.right &&
      clientY >= closeRect.top &&
      clientY <= closeRect.bottom &&
      closeBtn.classList.contains("visible")
    ) {
      close();
      return;
    }

    // Screen thirds
    if (clientX < third) {
      prev();
    } else if (clientX > third * 2) {
      next();
    } else {
      showTitle();
      showChrome();
    }
  }

  // Click handler — desktop only, suppressed after touch
  overlay.addEventListener("click", function (e) {
    if (touchHandled) {
      touchHandled = false;
      return;
    }
    handleZone(e.clientX, e.clientY);
  });

  // Mouse movement reveals relevant chrome
  overlay.addEventListener("mousemove", function (e) {
    var third = window.innerWidth / 3;
    var topZone = window.innerHeight * 0.15;

    if (e.clientY < topZone) {
      closeBtn.classList.add("visible");
      clearTimeout(chromeTimer);
      chromeTimer = setTimeout(function () {
        closeBtn.classList.remove("visible");
      }, 1500);
    }

    if (e.clientX < third) {
      arrowPrev.classList.add("visible");
      arrowNext.classList.remove("visible");
      clearTimeout(chromeTimer);
      chromeTimer = setTimeout(function () {
        arrowPrev.classList.remove("visible");
      }, 1500);
    } else if (e.clientX > third * 2) {
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
      // Two fingers — enter zoom mode
      isZooming = true;
      return;
    }
    if (isZooming) return; // still recovering from zoom
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  overlay.addEventListener("touchend", function (e) {
    if (e.touches.length > 0) {
      // Fingers still on screen
      if (e.touches.length === 1) isZooming = true; // one finger lifted during pinch
      return;
    }

    // All fingers lifted
    if (isZooming) {
      isZooming = false;
      touchHandled = true; // suppress click
      return;
    }

    if (startX < EDGE_DEAD_ZONE || startX > window.innerWidth - EDGE_DEAD_ZONE) return;

    var endX = e.changedTouches[0].clientX;
    var endY = e.changedTouches[0].clientY;
    var diffX = startX - endX;
    var diffY = startY - endY;

    touchHandled = true; // suppress subsequent click

    // Swipe down to close
    if (diffY < -60 && Math.abs(diffX) < Math.abs(diffY)) {
      close();
      return;
    }

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
