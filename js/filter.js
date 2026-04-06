document.addEventListener("DOMContentLoaded", function () {

  var btnContainer = document.getElementById("myBtnContainer");
  var more = document.getElementById("more");

  // Detect current gallery base path automatically
  var basePath = "/" + window.location.pathname.split("/").filter(Boolean)[0] + "/";

  function showMore() {
    if (more) {
      more.style.display = more.style.display === "none" ? "inline" : "none";
    }
  }

  window.showMore = showMore;

  // On category pages — navigate to category pages instead of filtering in place
  if (document.querySelector(".category-page")) {

    window.filterSelection = function (c, btn) {
      if (c === "latest" || c === "all") {
        window.location.href = basePath;
      } else {
        window.location.href = basePath + c + "/";
      }
    };

    // Add show to all columns so lightbox can find them
    document.querySelectorAll(".column").forEach(function (col) {
      col.classList.add("show");
    });

    // Set active button based on current URL
    var pathCategory = window.location.pathname.split("/").filter(Boolean).pop();
    if (btnContainer && pathCategory) {
      var btns = btnContainer.getElementsByClassName("btn");
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove("active");
        if (btns[i].textContent.trim().toLowerCase() === pathCategory) {
          btns[i].classList.add("active");
        }
      }
    }

    return;
  }

  // Main gallery page filter
  function filterSelection(c, btn) {
    var columns = document.getElementsByClassName("column");
    for (var i = 0; i < columns.length; i++) {
      columns[i].classList.remove("show");
      if (c === "all" || columns[i].classList.contains(c)) {
        columns[i].classList.add("show");
      }
    }

    // Update active button
    if (btnContainer) {
      var btns = btnContainer.getElementsByClassName("btn");
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove("active");
      }
      if (btn) btn.classList.add("active");
    }

    // Update URL
    if (c !== "all" && c !== "latest") {
      history.pushState(null, "", basePath + c + "/");
    } else {
      history.pushState(null, "", basePath);
    }
  }

  // Expose for onclick attributes
  window.filterSelection = filterSelection;

  // Hide more panel initially
  if (more) more.style.display = "none";

  // Initialize — show latest if any exist, otherwise show all
  var hasLatest = document.getElementsByClassName("latest").length > 0;
  if (hasLatest) {
    filterSelection("latest");
    if (btnContainer) {
      var btns = btnContainer.getElementsByClassName("btn");
      for (var i = 0; i < btns.length; i++) {
        if (btns[i].textContent.trim() === "Latest") {
          btns[i].classList.add("active");
          break;
        }
      }
    }
  } else {
    filterSelection("all");
    if (btnContainer) {
      var btns = btnContainer.getElementsByClassName("btn");
      for (var i = 0; i < btns.length; i++) {
        if (btns[i].textContent.trim() === "All") {
          btns[i].classList.add("active");
          break;
        }
      }
    }
  }

});
