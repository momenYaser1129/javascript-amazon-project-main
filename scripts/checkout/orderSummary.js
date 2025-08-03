import { cart, removeFromCart, updateDeliveryOption, updateCartQuantity, refreshCart } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";

function formatDate(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

const today = new Date();
const deliveryDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

export function renderOrderSummary() {
  const orderSummaryElement = document.querySelector(".js-order-summary");
  if (!orderSummaryElement) {
    return;
  }

  const currentCart = refreshCart();

  if (currentCart.length === 0) {
    orderSummaryElement.innerHTML = `
      <div class="empty-cart-message">
        Your cart is empty. <a href="amazon.html">Continue shopping</a>
      </div>
    `;
    return;
  }

  let cartSummaryHtml = ``;
  currentCart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct = getProduct(productId);
    
    if (!matchingProduct) {
      return;
    }

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = new Date();
    const deliveryDate = new Date(today.getTime() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000);
    const dateString = formatDate(deliveryDate);
    
    cartSummaryHtml += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}" alt="${matchingProduct.name}">

            <div class="cart-item-details">
                <div class="product-name">${matchingProduct.name}</div>
                <div class="product-price">$${(matchingProduct.priceCents / 100).toFixed(2)}</div>
                <div class="product-quantity">
                    <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">Update</span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
                </div>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">Choose a delivery option:</div>
                ${deliveryOptionHtml(matchingProduct, cartItem)}
            </div>
        </div>
    </div>`;
  });

  orderSummaryElement.innerHTML = cartSummaryHtml;

  addEventListeners();
}

function deliveryOptionHtml(matchingProduct, cartItem) {
  let html = ``;
  deliveryOptions.forEach((deliveryOption) => {
    const today = new Date();
    const deliveryDate = new Date(today.getTime() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000);
    const dateString = formatDate(deliveryDate);
    const priceString = deliveryOption.priceCents === 0
      ? "FREE"
      : `$${(deliveryOption.priceCents / 100).toFixed(2)}`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    html += `
      <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? "checked" : ""}
          class="delivery-option-input"   
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString}</div>
        </div>
      </div>`;
  });
  return html;
}

function addEventListeners() {
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      if (!productId) {
        return;
      }
      
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (container) {
        container.remove();
      }
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      if (!productId) {
        return;
      }

      const quantitySpan = link.previousElementSibling;
      if (!quantitySpan) {
        return;
      }

      const quantityLabel = quantitySpan.querySelector(".quantity-label");
      if (!quantityLabel) {
        return;
      }

      const currentQuantity = parseInt(quantityLabel.textContent);
      if (isNaN(currentQuantity)) {
        return;
      }
      
      const quantitySelector = document.createElement("select");
      quantitySelector.className = "quantity-selector";
      for (let i = 1; i <= 10; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        if (i === currentQuantity) {
          option.selected = true;
        }
        quantitySelector.appendChild(option);
      }
      
      quantityLabel.replaceWith(quantitySelector);
      
      const saveButton = document.createElement("button");
      saveButton.className = "save-quantity-link link-primary";
      saveButton.textContent = "Save";
      link.replaceWith(saveButton);
      
      saveButton.addEventListener("click", () => {
        const newQuantity = parseInt(quantitySelector.value);
        if (isNaN(newQuantity) || newQuantity < 1 || newQuantity > 10) {
          toast('Quantity must be between 1 and 10', 'error');
          return;
        }
        
        updateCartQuantity(productId, newQuantity);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;
      
      if (!productId || !deliveryOptionId) {
        return;
      }
      
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
