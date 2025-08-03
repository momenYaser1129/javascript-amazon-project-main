import { refreshOrders } from '../data/orders.js';
import { getProduct } from '../data/products.js';
import { addToCart, getCartTotal } from '../data/cart.js';

function formatCurrency(cents) {
  return (cents / 100).toFixed(2);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function getDeliveryDate(orderDateString, days = 7) {
  const orderDate = new Date(orderDateString);
  const deliveryDate = new Date(orderDate.getTime() + days * 24 * 60 * 60 * 1000);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return deliveryDate.toLocaleDateString('en-US', options);
}

function calculateOrderTotal(cart) {
  let total = 0;
  cart.forEach(cartItem => {
    const product = getProduct(cartItem.productId);
    if (product) {
      total += product.priceCents * cartItem.quantity;
    }
  });
  return total;
}

function createProductHtml(product, cartItem, orderDateString) {
  const deliveryDate = getDeliveryDate(orderDateString, 7);
  
  return `
    <div class="product-image-container">
      <img src="${product.image}" alt="${product.name}">
    </div>

    <div class="product-details">
      <div class="product-name">
        ${product.name}
      </div>
      <div class="product-delivery-date">
        Arriving on: ${deliveryDate}
      </div>
      <div class="product-quantity">
        Quantity: ${cartItem.quantity}
      </div>
      <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${product.id}">
        <img class="buy-again-icon" src="images/icons/buy-again.png">
        <span class="buy-again-message">Buy it again</span>
      </button>
    </div>

    <div class="product-actions">
    </div>
  `;
}

function createOrderHtml(order) {
  const orderDate = formatDate(order.orderTime || order.orderDate);
  const totalCost = calculateOrderTotal(order.cart);
  const formattedTotal = formatCurrency(totalCost);

  let productsHtml = '';
  order.cart.forEach(cartItem => {
    const product = getProduct(cartItem.productId);
    if (product) {
      productsHtml += createProductHtml(product, cartItem, order.orderTime || order.orderDate);
    }
  });

  return `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${orderDate}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formattedTotal}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>

      <div class="order-details-grid">
        ${productsHtml}
      </div>
    </div>
  `;
}

export function renderOrders() {
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }

  const userOrders = refreshOrders();

  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.textContent = getCartTotal();
  }

  if (userOrders.length === 0) {
    document.querySelector('.orders-grid').innerHTML = `
      <div class="empty-orders-message">
        You have no orders yet. <a href="amazon.html">Start shopping</a>
      </div>
    `;
    return;
  }

  let ordersHtml = '';
  
  userOrders.forEach((order) => {
    ordersHtml += createOrderHtml(order);
  });

  document.querySelector('.orders-grid').innerHTML = ordersHtml;

  document.querySelectorAll('.js-buy-again-button').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      window.location.href = `amazon.html?productId=${productId}`;
    });
  });
} 