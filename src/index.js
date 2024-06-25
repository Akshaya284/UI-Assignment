document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
  
    const shopNowBtn = document.getElementById("shopNowBtn");
    if (shopNowBtn) {
      shopNowBtn.addEventListener("click", () => {
        window.location.href = "../pages/shop.html";
      });
    }
  
    const productSearch = document.getElementById("productSearch");
  
    // Event listener for search input
    productSearch?.addEventListener("input", function () {
      const searchValue = productSearch.value.trim().toLowerCase();
  
      // Filter products based on search value
      const filteredProducts = allProducts.filter((product) => {
        return product.title.toLowerCase().includes(searchValue);
      });
  
      // Display filtered products
      productsContainer.innerHTML = ""; // Clear existing products
      populateFilteredProducts(filteredProducts);
    });
  
    const productsContainer = document.querySelector(".products-container");
    let allProducts = []; // To store all products fetched
    let allCategories = []; // To store all categories fetched
    let loadedProductsCount = 0; // Track how many products are loaded initially
    let totalProductsCount = 0; // Total number of products from the API
  
    // Select loading overlay
    const loadingOverlay = document.querySelector(".loading-overlay");
  
    // Show loading overlay initially
    loadingOverlay.style.display = "block";
  
    // Fetch products from the API
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((products) => {
        loadingOverlay.style.display = "none";
        allProducts = products; // Store all products
        totalProductsCount = allProducts.length; // Store total products count
  
        // Call function to populate initial products (first 10)
        populateProducts(loadedProductsCount, 10);
        loadedProductsCount += 10; // Increment loaded product count
  
        updateTotalProductCount();
  
        // Check if all products are loaded to hide Load More button
        checkLoadMoreButton();
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        // Ensure loading overlay is hidden in case of error
        loadingOverlay.style.display = "none";
      });
  
    // Fetch categories from the API
    fetch("https://fakestoreapi.com/products/categories")
      .then((response) => response.json())
      .then((categories) => {
        allCategories = categories; // Store all categories
  
        // Call function to populate categories initially
        populateCategories(categories);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  
    // Function to populate categories in the UI
    function populateCategories(categories) {
      const filtersContainer = document.querySelector(".filterCat");
      const categoriesList = document.createElement("div");
      categoriesList.className = "categories-list";
  
      categories.forEach((category) => {
        const categoryContainer = document.createElement("div");
        categoryContainer.className = "category-item";
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `category-${category}`;
        checkbox.value = category;
        checkbox.addEventListener("change", updateProducts);
  
        const label = document.createElement("label");
        label.textContent = category;
        label.setAttribute("for", `category-${category}`);
  
        categoryContainer.appendChild(checkbox);
        categoryContainer.appendChild(label);
        categoriesList.appendChild(categoryContainer);
      });
  
      filtersContainer.appendChild(categoriesList);
    }
  
    // Function to populate products in the UI
    function populateProducts(startIndex, count) {
      const endIndex = startIndex + count;
      const productsToDisplay = allProducts.slice(startIndex, endIndex);
  
      productsToDisplay.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.className = "productList";
  
        productElement.innerHTML = `
                  <img src="${product.image}" alt="${product.title}">
                  <h3>${product.title}</h3>
                  <p>$${product.price}</p>
              `;
  
        productsContainer.appendChild(productElement);
      });
      updateTotalProductCount();
      // Check if all products are loaded to hide Load More button
      checkLoadMoreButton();
    }
  
    // Function to update products based on selected categories
    function updateProducts() {
      loadingOverlay.style.display = "block"; // Show loading overlay
      const checkedCategories = Array.from(
        document.querySelectorAll(".category-item input:checked")
      ).map((checkbox) => checkbox.value);
  
      setTimeout(() => {
        if (checkedCategories.length === 0) {
          // If no categories are selected, show all products
          productsContainer.innerHTML = ""; // Clear existing products
          populateProducts(0, loadedProductsCount);
        } else {
          // Filter products based on selected categories
          const filteredProducts = allProducts.filter((product) => {
            return checkedCategories.includes(product.category);
          });
  
          productsContainer.innerHTML = ""; // Clear existing products
          populateFilteredProducts(filteredProducts);
        }
        loadingOverlay.style.display = "none"; // Hide loading overlay after updating products
      }, 500); // Simulate some delay for demonstration
    }
  
    // Function to reset price range filter
    function resetPriceRangeFilter() {
      minPriceSlider.value = 0;
      maxPriceSlider.value = 1000;
      minPriceValue.textContent = "0";
      maxPriceValue.textContent = "1000";
      filterProductsByPrice(0, 1000);
    }
  
    // Select the price range sliders and value elements
    const minPriceSlider = document.getElementById("minPrice");
    const maxPriceSlider = document.getElementById("maxPrice");
    const minPriceValue = document.getElementById("minPriceValue");
    const maxPriceValue = document.getElementById("maxPriceValue");
  
    // Reset price range filter on page load
    resetPriceRangeFilter();
  
    // Event listeners for price sliders
    minPriceSlider.addEventListener("input", updatePrices);
    maxPriceSlider.addEventListener("input", updatePrices);
  
    function updatePrices() {
      const minValue = parseInt(minPriceSlider.value);
      const maxValue = parseInt(maxPriceSlider.value);
  
      if (minValue > maxValue - 50) {
        if (event.target.id === "minPrice") {
          minPriceSlider.value = maxValue - 50;
        } else {
          maxPriceSlider.value = minValue + 50;
        }
      }
  
      minPriceValue.textContent = minPriceSlider.value;
      maxPriceValue.textContent = maxPriceSlider.value;
  
      filterProductsByPrice(minPriceSlider.value, maxPriceSlider.value);
    }
  
    function filterProductsByPrice(minPrice, maxPrice) {
      loadingOverlay.style.display = "block"; // Show loading overlay
  
      setTimeout(() => {
        const filteredProducts = allProducts.filter((product) => {
          return product.price >= minPrice && product.price <= maxPrice;
        });
  
        productsContainer.innerHTML = ""; // Clear existing products
        populateFilteredProducts(filteredProducts);
  
        loadingOverlay.style.display = "none"; // Hide loading overlay after updating products
      }, 500); // Simulate some delay for demonstration
    }
  
    // Function to populate filtered products in the UI
    function populateFilteredProducts(filteredProducts) {
      productsContainer.innerHTML = ""; // Clear existing products
  
      filteredProducts.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.className = "productList";
  
        productElement.innerHTML = `
                  <img src="${product.image}" alt="${product.title}">
                  <h3>${product.title}</h3>
                  <p>$${product.price}</p>
              `;
  
        productsContainer.appendChild(productElement);
      });
  
      updateTotalProductCount();
  
      // Check if all products are loaded to hide Load More button
      checkLoadMoreButton();
    }
  
    // Function to check if all products are loaded and hide Load More button if so
    function checkLoadMoreButton() {
      if (loadedProductsCount >= totalProductsCount) {
        const loadMoreBtn = document.querySelector(".load-more button");
        if (loadMoreBtn) {
          loadMoreBtn.style.display = "none";
        }
      }
    }
  
    function updateTotalProductCount() {
      const totalProductCountElement =
        document.getElementById("totalProductCount");
      if (totalProductCountElement) {
        const renderedProductsCount =
          productsContainer.querySelectorAll(".productList").length;
        totalProductCountElement.textContent = `${renderedProductsCount} Results`;
      }
    }
  
    // Load more button functionality
    const loadMoreBtn = document.querySelector(".load-more button");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        loadingOverlay.style.display = "block"; // Show loading overlay
        const remainingProducts = totalProductsCount - loadedProductsCount;
        const nextBatch = remainingProducts >= 10 ? 10 : remainingProducts;
  
        setTimeout(() => {
          populateProducts(loadedProductsCount, nextBatch);
          loadedProductsCount += nextBatch;
  
          // Check if all products are loaded to hide Load More button
          checkLoadMoreButton();
          loadingOverlay.style.display = "none"; // Hide loading overlay after loading more products
        }, 500); // Simulate some delay for demonstration
      });
    }
  
    // Sort dropdown functionality
    const sortDropdown = document.querySelector(".sortOptions select");
    if (sortDropdown) {
      sortDropdown.addEventListener("change", function () {
        const sortBy = this.value;
        sortProducts(sortBy);
      });
    }
    // Function to sort products
    function sortProducts(sortBy) {
      if (sortBy === "Price -- Low to High") {
        allProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === "Price -- High to Low") {
        allProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === "Ratings") {
        allProducts.sort((a, b) => b.rating.rate - a.rating.rate);
      }
      // Clear and repopulate products container
      productsContainer.innerHTML = "";
      populateProducts(0, loadedProductsCount);
    }

  });
  