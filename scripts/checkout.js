import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { cart, getCartTotal } from "../data/cart.js";

// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('signedUser'));
if (!currentUser) {
  window.location.href = 'Log-in Sign-up.html';
}

// Initialize cart display
function initializeCart() {
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.textContent = getCartTotal();
  }
}

// Initialize the checkout page
function initializeCheckout() {
  if (cart.length === 0) {
    document.querySelector('.js-order-summary').innerHTML = `
      <div class="empty-cart-message">
        Your cart is empty. <a href="amazon.html">Continue shopping</a>
      </div>
    `;
    document.querySelector('.js-payment-summary').innerHTML = '';
    return;
  }

  renderOrderSummary();
  renderPaymentSummary();
}

// Initialize the page
initializeCart();
initializeCheckout();
