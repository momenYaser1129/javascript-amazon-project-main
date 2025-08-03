import { cart, refreshCart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { addOrder } from "../../data/orders.js";

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

export function renderPaymentSummary() {
  const paymentSummaryElement = document.querySelector(".js-payment-summary");
  if (!paymentSummaryElement) {
    return;
  }

  const currentCart = refreshCart();

  if (currentCart.length === 0) {
    paymentSummaryElement.innerHTML = '';
    return;
  }

  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let totalItems = 0;

  currentCart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    if (!product) {
      return;
    }
    
    productPriceCents += product.priceCents * cartItem.quantity;
    totalItems += cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHtml = `
     <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (${totalItems}):</div>
            <div class="payment-summary-money">$${(productPriceCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${(shippingPriceCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${(totalBeforeTaxCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(taxCents / 100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${(totalCents / 100).toFixed(2)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>`;

  paymentSummaryElement.innerHTML = paymentSummaryHtml;

  setTimeout(() => {
    const placeOrderButton = document.querySelector(".js-place-order");
    if (placeOrderButton) {
      const newButton = placeOrderButton.cloneNode(true);
      placeOrderButton.parentNode.replaceChild(newButton, placeOrderButton);
      
      newButton.addEventListener("click", handlePlaceOrder);
    }
  }, 100);
}

async function handlePlaceOrder() {
  const currentCart = refreshCart();
  
  if (!currentCart || currentCart.length === 0) {
    if (window.toast) {
      window.toast('Your cart is empty. Please add items before placing an order.', 'error');
    } else {
      alert('Your cart is empty. Please add items before placing an order.');
    }
    return;
  }
  
  for (const cartItem of currentCart) {
    if (!cartItem.productId || !cartItem.quantity || cartItem.quantity <= 0) {
      if (window.toast) {
        window.toast('Invalid cart data. Please refresh the page and try again.', 'error');
      } else {
        alert('Invalid cart data. Please refresh the page and try again.');
      }
      return;
    }
    
    const product = getProduct(cartItem.productId);
    if (!product) {
      if (window.toast) {
        window.toast('Some products in your cart are no longer available.', 'error');
      } else {
        alert('Some products in your cart are no longer available.');
      }
      return;
    }
  }
  
  try {
    const button = document.querySelector(".js-place-order");
    if (button) {
      button.disabled = true;
      button.textContent = "Processing...";
    }
    
    let order;
    try {
      const response = await fetch("https://supersimplebackend.dev/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: currentCart,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      order = await response.json();
    } catch (backendError) {
      order = {
        id: Date.now().toString(),
        cart: currentCart,
        orderDate: new Date().toISOString(),
        orderTime: new Date().toISOString(),
        status: 'pending',
        totalCostCents: calculateOrderTotal(currentCart)
      };
    }
    
    addOrder(order);
    
    const currentUser = JSON.parse(localStorage.getItem('signedUser'));
    if (currentUser) {
      const cartKey = `cart_${currentUser.email}`;
      localStorage.setItem(cartKey, JSON.stringify([]));
    }
    
    const cartQuantityElement = document.querySelector('.js-cart-quantity');
    if (cartQuantityElement) {
      cartQuantityElement.textContent = '0';
    }
    
    if (window.toast) {
      window.toast('Order placed successfully!', 'success');
    }
    
    setTimeout(() => {
      window.location.href = 'orders.html';
    }, 1000);
    
  } catch (error) {
    const button = document.querySelector(".js-place-order");
    if (button) {
      button.disabled = false;
      button.textContent = "Place your order";
    }
    
    if (window.toast) {
      window.toast('Failed to place order. Please try again.', 'error');
    } else {
      alert('Failed to place order. Please try again.');
    }
  }
}
