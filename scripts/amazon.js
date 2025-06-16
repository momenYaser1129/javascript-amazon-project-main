import { cart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js";
import "./toast.js";
const currentUser = JSON.parse(localStorage.getItem('signedUser'));
if (!currentUser) {
  window.location.href = 'Log-in Sign-up.html';
}

const signedUser = JSON.parse(localStorage.getItem("signedUser"));
function loginNameFun() {
  document.getElementById(
    "logInUserName"
  ).innerText = ` ${signedUser.username}`;
}
loginNameFun() ;

const signOutButton = document.querySelector('.sign-out-button');
if (signOutButton) {
  signOutButton.addEventListener('click', () => {
    localStorage.removeItem('signedUser');
    window.location.href = 'Log-in Sign-up.html';
  });
}

// loadProducts(renderProductsGrid);
// function renderProductsGrid() {
let productsHtml = ``;
products.forEach((product) => {
  productsHtml += `
        <div class="product-container">
            <div class="product-image-container">
              <img
                class="product-image"
                  src="${product.image}"
              />
            </div>
  
            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>
  
            <div class="product-rating-container">
              <img
                class="product-rating-stars"
                src="images/ratings/rating-${product.rating.stars * 10}.png"
              />
              <div class="product-rating-count link-primary">${
                product.rating.count
              }</div>
            </div>
  
            <div class="product-price">$${(product.priceCents / 100).toFixed(
              2
            )}</div>
  
            <div class="product-quantity-container ">
              <select class = " js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
  
            <div class="product-spacer"></div>
  
            <div class="added-to-cart js-added-to-cart-${product.id}">
              <img src="../images/icons/checkmark.png" />
              Added
            </div>
  
            <button class="add-to-cart-button button-primary js-add-to-cart" 
            data-product-id = "${product.id}">Add to Cart</button>
          </div>
      `;
});

document.querySelector(".js-products-grid").innerHTML = productsHtml;
function updateCartQuantity(productId) {
  let cartQuantinty = 0;

  cart.forEach((cartItem) => {
    cartQuantinty += cartItem.quantity;
  });
  const addedMessageTimeouts = {};

  document.querySelector(".js-cart-quantity").innerHTML = cartQuantinty;

  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
  addedMessage.classList.add("added-to-cart-visible");
  const previousTimeoutId = addedMessageTimeouts[productId];
  if (previousTimeoutId) {
    clearTimeout(previousTimeoutId);
  }

  const timeoutId = setTimeout(() => {
    addedMessage.classList.remove("added-to-cart-visible");
  }, 2000);

  // Save the timeoutId for this product
  // so we can stop it later if we need to.
  addedMessageTimeouts[productId] = timeoutId;
}

document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;
    // productName its transformed from kebab case (product-name) to camel case
    addToCart(productId);
    updateCartQuantity(productId);
  });
});

// Add search functionality
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-bar');

function renderProductsGrid(productList) {
  let productsHtml = '';
  productList.forEach((product) => {
    productsHtml += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}" />
        </div>
        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>
        <div class="product-rating-container">
          <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png" />
          <div class="product-rating-count link-primary">${product.rating.count}</div>
        </div>
        <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>
        <div class="product-quantity-container ">
          <select class = " js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <div class="product-spacer"></div>
        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="../images/icons/checkmark.png" />
          Added
        </div>
        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id = "${product.id}">Add to Cart</button>
      </div>
    `;
  });
  document.querySelector('.js-products-grid').innerHTML = productsHtml;
  // Reattach add to cart listeners
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId);
      updateCartQuantity(productId);
    });
  });
}

// Initial render
renderProductsGrid(products);

function filterProducts(term) {
  const searchTerm = term.toLowerCase().trim();
  if (!searchTerm) {
    renderProductsGrid(products);
    return;
  }
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    (product.keywords && product.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)))
  );
  renderProductsGrid(filteredProducts);
}

searchInput.addEventListener('input', (e) => {
  filterProducts(e.target.value);
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  filterProducts(searchInput.value);
});

