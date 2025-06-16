import { cart, removeFromCart, updateDeliveryOption, updateCartQuantity } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.11/esm/index.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
const today = dayjs();
const deliveryDate = today.add(7, "days");
console.log(deliveryDate.format("dddd, MMMM D"));

export function renderOrderSummary() {
  let cartSummaryHtml = ``;
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");
    
    cartSummaryHtml += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}">

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

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHtml;

  // Add event listeners after rendering
  addEventListeners();
}

function deliveryOptionHtml(matchingProduct, cartItem) {
  let html = ``;
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");
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
  // Delete functionality
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      renderPaymentSummary();
    });
  });

  // Update quantity functionality
  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const quantityLabel = link.previousElementSibling.querySelector(".quantity-label");
      const currentQuantity = parseInt(quantityLabel.textContent);
      
      // Create quantity selector
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
      
      // Replace quantity label with selector
      quantityLabel.replaceWith(quantitySelector);
      
      // Add save button
      const saveButton = document.createElement("button");
      saveButton.className = "save-quantity-link link-primary";
      saveButton.textContent = "Save";
      link.replaceWith(saveButton);
      
      // Handle save
      saveButton.addEventListener("click", () => {
        const newQuantity = parseInt(quantitySelector.value);
        updateCartQuantity(productId, newQuantity);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
  });

  // Delivery option functionality
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
