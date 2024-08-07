const TAX_RATE = 0.13; // Tax rate of 13%

// Function to fetch products from JSON file
async function fetchProducts() {
  try {
    const response = await fetch("products.json");
    if (!response.ok) throw new Error("Network response was not ok");
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to display products dynamically
async function displayProducts() {
  const products = await fetchProducts();
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
            <img src="${product.imgSrc}" alt="${product.name}"
            onerror="console.error('Failed to load image for ${
              product.name
            } at ${product.imgSrc}'); this.src='images/products/img_2.jpg'">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <p class="description">${product.description}</p>
            <button onclick="addToCart('${product.name}', ${product.price}, '${
      product.imgSrc
    }')">Add to Cart</button>
        `;
    productList.appendChild(productDiv);
  });
}

// Function to add product to cart
function addToCart(name, price, imgSrc) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const existingProductIndex = cartItems.findIndex(
    (item) => item.name === name
  );

  if (existingProductIndex > -1) {
    // Product already in cart, update quantity
    cartItems[existingProductIndex].quantity += 1;
  } else {
    // New product
    cartItems.push({ name, price, imgSrc, quantity: 1 });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  updateCartUI();
  showNotification(`${name} added to cart`);
}

// Function to remove product from cart
function removeFromCart(name) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems = cartItems.filter((item) => item.name !== name);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  updateCartUI();
}

// Function to update cart UI with tax calculation
function updateCartUI() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  let subtotal = 0;

  cartItems.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
        <img src="${item.imgSrc}" alt="${item.name}">
        <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>Price: $${item.price.toFixed(2)}</p>
            <p>Quantity: ${item.quantity}</p>
            <button onclick="removeFromCart('${item.name}')">Remove</button>
        </div>
        `;
    cartItemsContainer.appendChild(itemDiv);

    subtotal += item.price * item.quantity;
  });

  // Calculate total tax and total price
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const totalDiv = document.getElementById("cart-summary");
  totalDiv.innerHTML = `Subtotal: $${subtotal.toFixed(
    2
  )}<br>Tax(13%): $${tax.toFixed(2)}<br>Total:  $${total.toFixed(2)}`;
}

// Function to show notification
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.innerHTML = message;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Function to switch tabs
function showTab(tabId) {
  document.querySelectorAll("main section").forEach((section) => {
    section.style.display = "none";
  });
  document.getElementById(tabId).style.display = "block";
}

// Event listener for page load
document.addEventListener("DOMContentLoaded", () => {
  displayProducts();
  updateCartUI();
});
