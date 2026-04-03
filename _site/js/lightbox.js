(function () {
  var images = [];
  var current = 0;
  var startX = 0;
  var startY = 0;
  var titleTimer;
  var chromeTimer;
  var EDGE_DEAD_ZONE = 30; // px from screen edge to ignore as browser gesture

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

  // Show chrome (arrows, close button) briefly then fade
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
    show(current);
    overlay.classList.add("active");
    document.body.classList.add("lb-open");
    if (originLink) originLink.blur();
  }

  // Close lightbox
  function close() {
    overlay.classList.remove("active");
    document.body.classList.remove("lb-open");
    hideChrome();
    hideTitle();
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

  // Get image boundaries for tap zone calculation
  function getImgRect() {
    return img.getBoundingClientRect();
  }

  // Handle tap/click on overlay
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      // Clicked dark margin outside image
      close();
      return;
    }

    if (e.target === title) {
      // Tapping title dismisses it
      hideTitle();
      return;
    }

    if (e.target === closeBtn) {
      close();
      return;
    }

    if (e.target === img || e.target === overlay) {
      var rect = getImgRect();
      var third = rect.width / 3;
      var relX = e.clientX - rect.left;

      if (relX < 0 || relX > rect.width) {
        // Outside image horizontally — close
        close();
      } else if (relX < third) {
        // Left third — previous
        prev();
      } else if (relX > third * 2) {
        // Right third — next
        next();
      } else {
        // Center third — wake title and chrome
        showTitle();
        showChrome();
      }
    }
  });

  // Close button explicit handler
  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    close();
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
    // Ignore multi-touch (pinch to zoom)
    if (e.touches.length > 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  overlay.addEventListener("touchend", function (e) {
    // Ignore if fingers still on screen (end of pinch)
    if (e.touches.length > 0) return;
    // Ignore if started in edge dead zone
    if (startX < EDGE_DEAD_ZONE || startX > window.innerWidth - EDGE_DEAD_ZONE) return;

    var diffX = startX - e.changedTouches[0].clientX;
    var diffY = startY - e.changedTouches[0].clientY;

    // Swipe down to close
    if (diffY < -60 && Math.abs(diffX) < Math.abs(diffY)) {
      close();
      return;
    }

    // Horizontal swipe to navigate
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      diffX > 0 ? next() : prev();
    }
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
