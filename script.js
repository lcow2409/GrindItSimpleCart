document.addEventListener("DOMContentLoaded", () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      displayProducts(data);
      loadCart();
    })
    .catch((error) => console.error("Error fetching data:", error));
});

const cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayProducts(products) {
  const productList = document.getElementById("product-list");
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
            <h2>${product.name}</h2>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
    productList.appendChild(productDiv);
  });
}

function addToCart(productId) {
  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      }
    });
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartSummary = document.getElementById("cart-summary");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
        `;
    cartItems.appendChild(itemDiv);
    total += item.price;
  });

  cartSummary.innerHTML = `
        <h3>Total: $${total.toFixed(2)}</h3>
        <button onclick="checkout()">Checkout</button>
    `;
}

function loadCart() {
  updateCart();
}

function checkout() {
  localStorage.removeItem("cart");
  cart.length = 0;
  updateCart();
}
