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
  if (!cart || !Array.isArray(cart)) {
    return 0;
  }
  
  let total = 0;
  cart.forEach(cartItem => {
    if (!cartItem || !cartItem.productId || !cartItem.quantity) {
      return;
    }
    
    const product = getProduct(cartItem.productId);
    if (product && product.priceCents) {
      total += product.priceCents * cartItem.quantity;
    }
  });
  return total;
}

function createProductHtml(product, cartItem, orderDateString) {
  console.log('Creating product HTML for:', { product, cartItem });
  if (!product || !cartItem) {
    console.error('Invalid product or cart item:', { product, cartItem });
    return '';
  }
  
  const deliveryDate = getDeliveryDate(orderDateString, 7);
  
  return `
    <div class="product-image-container">
      <img src="${product.image || ''}" alt="${product.name || 'Product'}" onerror="this.style.display='none'">
    </div>

    <div class="product-details">
      <div class="product-name">
        ${product.name || 'Unknown Product'}
      </div>
      <div class="product-delivery-date">
        Arriving on: ${deliveryDate}
      </div>
      <div class="product-quantity">
        Quantity: ${cartItem.quantity || 1}
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
  console.log('Creating HTML for order:', order);
  if (!order || !order.cart || !Array.isArray(order.cart)) {
    console.error('Invalid order data:', order);
    return '';
  }

  const orderDate = formatDate(order.orderTime || order.orderDate || new Date().toISOString());
  const totalCost = calculateOrderTotal(order.cart);
  const formattedTotal = formatCurrency(totalCost);

  let productsHtml = '';
  order.cart.forEach(cartItem => {
    if (!cartItem || !cartItem.productId) {
      console.error('Invalid cart item:', cartItem);
      return;
    }
    
    const product = getProduct(cartItem.productId);
    if (product) {
      productsHtml += createProductHtml(product, cartItem, order.orderTime || order.orderDate || new Date().toISOString());
    } else {
      console.error('Product not found for ID:', cartItem.productId);
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
          <div>${order.id || 'N/A'}</div>
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

  console.log('Rendering orders for user:', currentUser.email);
  const userOrders = refreshOrders();
  console.log('Retrieved orders:', userOrders);

  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.textContent = getCartTotal();
  }

  const ordersGridElement = document.querySelector('.orders-grid');
  if (!ordersGridElement) {
    console.error('Orders grid element not found');
    return;
  }

  if (!userOrders || userOrders.length === 0) {
    ordersGridElement.innerHTML = `
      <div class="empty-orders-message">
        You have no orders yet. <a href="amazon.html">Start shopping</a>
      </div>
    `;
    return;
  }

  let ordersHtml = '';
  
  userOrders.forEach((order) => {
    try {
      ordersHtml += createOrderHtml(order);
    } catch (error) {
      console.error('Error creating order HTML:', error, order);
    }
  });

  ordersGridElement.innerHTML = ordersHtml;

  document.querySelectorAll('.js-buy-again-button').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      window.location.href = `amazon.html?productId=${productId}`;
    });
  });
} 