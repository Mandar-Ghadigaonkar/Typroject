// search-box open close js code
let navbar = document.querySelector(".navbar");
let searchBox = document.querySelector(".search-box .bx-search");
// let searchBoxCancel = document.querySelector(".search-box .bx-x");

searchBox.addEventListener("click", () => {
  navbar.classList.toggle("showInput");
  if (navbar.classList.contains("showInput")) {
    searchBox.classList.replace("bx-search", "bx-x");
  } else {
    searchBox.classList.replace("bx-x", "bx-search");
  }
});

// sidebar open close js code
let navLinks = document.querySelector(".nav-links");
let menuOpenBtn = document.querySelector(".navbar .bx-menu");
let menuCloseBtn = document.querySelector(".nav-links .bx-x");
menuOpenBtn.onclick = function () {
  navLinks.style.left = "0";
}
menuCloseBtn.onclick = function () {
  navLinks.style.left = "-100%";
}


// sidebar submenu open close js code
let htmlcssArrow = document.querySelector(".htmlcss-arrow");
htmlcssArrow.onclick = function () {
  navLinks.classList.toggle("show1");
}
let moreArrow = document.querySelector(".more-arrow");
moreArrow.onclick = function () {
  navLinks.classList.toggle("show2");
}
let jsArrow = document.querySelector(".js-arrow");
jsArrow.onclick = function () {
  navLinks.classList.toggle("show3");
}
  // JavaScript code to dynamically adjust the position of the total container
  < script >
  // Function to update the position of the total container
  function updateTotalPosition() {
    var cartContainerHeight = document.getElementById('cart-container').offsetHeight;
    var totalContainer = document.getElementById('cartTotal');
    var windowHeight = window.innerHeight;
    var totalContainerHeight = totalContainer.offsetHeight;

    // Calculate the position of the total container
    var topPosition = Math.min(windowHeight - totalContainerHeight - 20, cartContainerHeight + 167);

    // If the scroll position is above the calculated top position, make the total container fixed at the bottom
    if (window.pageYOffset > topPosition) {
      totalContainer.style.position = 'fixed';
      totalContainer.style.bottom = '20px';
    } else {
      // Otherwise, keep the total container relative
      totalContainer.style.position = 'relative';
      totalContainer.style.bottom = 'auto';
    }
  }

// Call the function initially and whenever the window is scrolled or resized
updateTotalPosition();
window.addEventListener('scroll', updateTotalPosition);
window.addEventListener('resize', updateTotalPosition);