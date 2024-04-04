let profileDropdownList = document.querySelector(".profile-dropdown-list");
    let btn = document.querySelector(".profile-dropdown-btn");
    
    let classList = profileDropdownList.classList;
    
    const toggle = () => classList.toggle("active");
    
    window.addEventListener("click", function (e) {
      if (!btn.contains(e.target)) classList.remove("active");
    });





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




function searchBooks() {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput !== "") {
        // Send AJAX request to server-side search endpoint
        fetch(`/search?query=${searchInput}`)
            .then(response => response.json())
            .then(data => {
                console.log("Search results:", data);
                displaySearchResults(data); // Display search results on the page
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.log("Search input is empty");
    }
}

// Function to display search results dynamically
function displaySearchResults(results) {
    const searchResultsContainer = document.querySelector("#searchResults .arrivals_box");
    searchResultsContainer.innerHTML = ""; // Clear previous search results

    if (results && results.length > 0) {
        results.forEach(book => {
            // Create a container for each book
            const bookContainer = document.createElement("div");
            bookContainer.classList.add("arrivals_card");

            // Create elements to display each book in the search results
            const bookElement = document.createElement("div");
            bookElement.classList.add("arrivals_image");
            bookElement.innerHTML = `
        <img src="./photos/${book.image}" alt="${book.name}">
    `;

            const featuredBookTag = document.createElement("div");
            featuredBookTag.classList.add("featurde_book_tag");
            featuredBookTag.innerHTML = `
        <h3>${book.name}</h3>
        <p class="writer">Publisher: ${book.publisher}</p>
        <p class="book_price">Price: ₹${book.price}</p>
    `;

            const formElement = document.createElement("form");
            formElement.action = "/addtocart";
            formElement.method = "post";
            formElement.innerHTML = `
        <input type="hidden" name="id" value="${book.id}">
        <input type="hidden" name="name" value="${book.name}">
        <input type="hidden" name="publisher" value="${book.publisher}">
        <input type="hidden" name="price" value="${book.price}">
        <input type="hidden" name="image" value="${book.image}">
        <input type="hidden" name="quantity" value="1">
        <input type="hidden" name="saleprice" value="${book.saleprice}">
        <input type="submit" class="f_btn" value="Add to Cart">
    `;

            // Append elements to the book container
            bookContainer.appendChild(bookElement);
            bookContainer.appendChild(featuredBookTag);
            bookContainer.appendChild(formElement);

            // Append the book container to the search results container
            searchResultsContainer.appendChild(bookContainer);
        });
    } else {
        // Display a message if no search results found
        searchResultsContainer.textContent = "No results found.";
    }
}

