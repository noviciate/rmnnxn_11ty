// filter
filterSelection("all")
function filterSelection(c, btn) {
  var columns = document.getElementsByClassName("column");
  for (var i = 0; i < columns.length; i++) {
    columns[i].classList.remove("show");
    if (c === "all" || columns[i].classList.contains(c)) {
      columns[i].classList.add("show");
    }
  }
  
  // Remove active from all buttons
  var btns = document.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.remove("active");
  }
  
  // Add active to clicked button
  if (btn) {
    btn.classList.add("active");
  }

  if (c !== "all" && c !== "latest") {
    history.pushState(null, "", "/photos/" + c + "/");
  } else {
    history.pushState(null, "", "/photos/");
  }
}

function showMore() {
  var more = document.getElementById("more");
  more.style.display = more.style.display === "none" ? "inline" : "none";
}

// Initialize
var hasLatest = document.getElementsByClassName("latest").length > 0;
if (hasLatest) {
  filterSelection("latest");
  // Set initial active button
  var btns = document.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].textContent.trim() === "Latest") {
      btns[i].classList.add("active");
      break;
    }
  }
} else {
  filterSelection("all");
  var btns = document.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].textContent.trim() === "All") {
      btns[i].classList.add("active");
      break;
    }
  }
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
// Set initial active button
var btns = document.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  if (btns[i].textContent.trim() === "Latest") {
    btns[i].classList.add("active");
    break;
  }
}

var x = document.getElementById("more");
document.getElementById('more').style.display = 'none';

function showMore() {

  if (x.style.display === "none") {
    x.style.display = "inline";
  } else {
    x.style.display = "none";
  }
}

// Preserve scroll
window.addEventListener('scroll',function() {
    //When scroll change, you save it on localStorage.
    localStorage.setItem('scrollPosition',window.scrollY);
},false);

window.addEventListener('load',function() {
    if(localStorage.getItem('scrollPosition') !== null)
       window.scrollTo(0, localStorage.getItem('scrollPosition'));
},false);
