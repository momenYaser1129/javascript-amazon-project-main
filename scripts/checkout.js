import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { cart, getCartTotal, refreshCart } from "../data/cart.js";

const currentUser = JSON.parse(localStorage.getItem('signedUser'));
if (!currentUser) {
  window.location.href = 'index.html';
}

function initializeCart() {
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    const total = getCartTotal();
    cartQuantityElement.textContent = total;
  }
}

function initializeCheckout() {
  const orderSummaryElement = document.querySelector('.js-order-summary');
  const paymentSummaryElement = document.querySelector('.js-payment-summary');
  
  if (!orderSummaryElement || !paymentSummaryElement) {
    return;
  }

  const currentCart = refreshCart();

  if (currentCart.length === 0) {
    orderSummaryElement.innerHTML = `
      <div class="empty-cart-message">
        Your cart is empty. <a href="amazon.html">Continue shopping</a>
      </div>
    `;
    paymentSummaryElement.innerHTML = '';
    return;
  }

  renderOrderSummary();
  renderPaymentSummary();
}

initializeCart();
initializeCheckout();
