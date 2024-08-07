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
  showNotification(name); // Pass the product name to the notification function
}

// Function to update cart UI
function updateCartUI() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  cartItems.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
              <img src="${item.imgSrc}" alt="${item.name}">
              <h3>${item.name}</h3>
              <p>Price: $${item.price.toFixed(2)}</p>
              <p>Quantity: ${item.quantity}</p>
          `;
    cartItemsContainer.appendChild(itemDiv);
  });

  // Calculate and display total
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalDiv = document.getElementById("cart-total");
  totalDiv.innerHTML = `Total: $${total.toFixed(2)}`;
}

// Function to show notification
function showNotification(productName) {
  const notification = document.getElementById("notification");
  notification.innerHTML = `${productName} added to cart`;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Function to show tab
function showTab(tabId) {
  const tabs = document.querySelectorAll("main section");
  tabs.forEach((tab) => (tab.style.display = "none"));
  document.getElementById(tabId).style.display = "block";
}

// Initialize cart UI on page load
document.addEventListener("DOMContentLoaded", updateCartUI);
