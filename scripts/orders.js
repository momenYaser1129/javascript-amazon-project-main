import { orders } from '../data/orders.js';
import { getProduct } from '../data/products.js';
import { addToCart, getCartTotal } from '../data/cart.js';
import dayjs from "https://unpkg.com/dayjs@1.11.11/esm/index.js";

// Helper function to format currency
function formatCurrency(cents) {
  return (cents / 100).toFixed(2);
}

// Helper function to get delivery date
function getDeliveryDate(orderDate, days = 7) {
  return orderDate.add(days, 'days').format('MMMM D, YYYY');
}

// Helper function to create product HTML
function createProductHtml(product, productOrder, orderDate) {
  const deliveryDate = getDeliveryDate(orderDate);
  
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
        Quantity: ${productOrder.quantity}
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

// Helper function to create order HTML
function createOrderHtml(order, productsHtml) {
  const orderDate = dayjs(order.orderTime);
  const formattedDate = orderDate.format('MMMM D, YYYY');
  const formattedTotal = formatCurrency(order.totalCostCents);

  return `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${formattedDate}</div>
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
  // Get current user's orders
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }

  // Get orders from localStorage
  const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
  const userOrders = storedOrders.filter(order => order.userId === currentUser.id);

  // Update cart quantity display
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
    const orderDate = dayjs(order.orderTime);
    let productsHtml = '';
    
    order.products.forEach((productOrder) => {
      const product = getProduct(productOrder.productId);
      if (!product) return; // Skip if product not found
      
      productsHtml += createProductHtml(product, productOrder, orderDate);
    });

    ordersHtml += createOrderHtml(order, productsHtml);
  });

  document.querySelector('.orders-grid').innerHTML = ordersHtml;

  // Add event listeners for "Buy it again" buttons
  document.querySelectorAll('.js-buy-again-button').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      window.location.href = `amazon.html?productId=${productId}`;
    });
  });
} 