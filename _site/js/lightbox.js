(function () {
  var images = [];
  var current = 0;
  var startX = 0;
  var titleTimer;
  var arrowTimer;

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

  var imgWrapper = document.createElement("div");
  imgWrapper.id = "lb-img-wrapper";

  var img = document.createElement("img");
  img.id = "lb-img";

  var title = document.createElement("div");
  title.id = "lb-title";

  var zoneLeft = document.createElement("div");
  zoneLeft.id = "lb-zone-left";

  var zoneCenter = document.createElement("div");
  zoneCenter.id = "lb-zone-center";

  var zoneRight = document.createElement("div");
  zoneRight.id = "lb-zone-right";

  var arrowPrev = document.createElement("div");
  arrowPrev.id = "lb-prev";
  arrowPrev.textContent = "‹";

  var arrowNext = document.createElement("div");
  arrowNext.id = "lb-next";
  arrowNext.textContent = "›";

  var closeBtn = document.createElement("div");
  closeBtn.id = "lb-close";
  closeBtn.textContent = "×";

  imgWrapper.appendChild(img);
  imgWrapper.appendChild(zoneLeft);
  imgWrapper.appendChild(zoneCenter);
  imgWrapper.appendChild(zoneRight);
  overlay.appendChild(imgWrapper);
  overlay.appendChild(title);
  overlay.appendChild(arrowPrev);
  overlay.appendChild(arrowNext);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  // Show arrows and close button briefly then fade
  function showChrome() {
    arrowPrev.classList.add("visible");
    arrowNext.classList.add("visible");
    closeBtn.classList.add("visible");
    clearTimeout(arrowTimer);
    arrowTimer = setTimeout(function () {
      arrowPrev.classList.remove("visible");
      arrowNext.classList.remove("visible");
      closeBtn.classList.remove("visible");
    }, 2000);
  }

  // Hide all chrome immediately
  function hideChrome() {
    clearTimeout(arrowTimer);
    arrowPrev.classList.remove("visible");
    arrowNext.classList.remove("visible");
    closeBtn.classList.remove("visible");
  }

  // Open lightbox
  function open(index, originLink) {
    buildImageList();
    current = index;
    show(current);
    overlay.classList.add("active");
    document.body.classList.add("lb-open");
    if (originLink) originLink.blur();
    showChrome();
  }

  // Close lightbox
  function close() {
    overlay.classList.remove("active");
    document.body.classList.remove("lb-open");
    clearTimeout(titleTimer);
    hideChrome();
  }

  // Show image at index
  function show(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    current = index;

    img.src = images[current].src;
    img.alt = images[current].title;

    // Fade title in then out
    clearTimeout(titleTimer);
    title.textContent = images[current].title;
    title.classList.remove("fade-out");
    title.style.opacity = "1";
    titleTimer = setTimeout(function () {
      title.classList.add("fade-out");
    }, 2000);

    showChrome();
  }

  function prev() { show(current - 1); }
  function next() { show(current + 1); }

  // Click dark overlay outside image wrapper to close
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });

  // Left zone goes previous
  zoneLeft.addEventListener("click", function (e) {
    e.stopPropagation();
    prev();
  });

  // Center zone closes
  zoneCenter.addEventListener("click", function (e) {
    e.stopPropagation();
    close();
  });

  // Right zone goes next
  zoneRight.addEventListener("click", function (e) {
    e.stopPropagation();
    next();
  });

  // Close button
  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    close();
  });

  // Mouse movement reveals relevant chrome near edges
  overlay.addEventListener("mousemove", function (e) {
    var third = window.innerWidth / 3;
    var topZone = window.innerHeight * 0.15;

    // Always show close when near top
    if (e.clientY < topZone) {
      closeBtn.classList.add("visible");
      clearTimeout(arrowTimer);
      arrowTimer = setTimeout(function () {
        closeBtn.classList.remove("visible");
      }, 1500);
    }

    if (e.clientX < third) {
      arrowPrev.classList.add("visible");
      arrowNext.classList.remove("visible");
      clearTimeout(arrowTimer);
      arrowTimer = setTimeout(function () {
        arrowPrev.classList.remove("visible");
      }, 1500);
    } else if (e.clientX > third * 2) {
      arrowNext.classList.add("visible");
      arrowPrev.classList.remove("visible");
      clearTimeout(arrowTimer);
      arrowTimer = setTimeout(function () {
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

  // Swipe support
  overlay.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });

  overlay.addEventListener("touchend", function (e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    } else if (Math.abs(diff) < 10) {
      close();
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
