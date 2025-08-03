function getUserCart() {
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    return [];
  }
  
  const cartKey = `cart_${currentUser.email}`;
  const userCart = localStorage.getItem(cartKey);
  
  if (!userCart) {
    return [];
  }
  
  try {
    const parsedCart = JSON.parse(userCart);
    return parsedCart;
  } catch (error) {
    return [];
  }
}

export let cart = getUserCart();

export function refreshCart() {
  cart = getUserCart();
  return cart;
}

function saveToStorage() {
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    return;
  }
  
  const cartKey = `cart_${currentUser.email}`;
  try {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch (error) {
  }
}

export function addToCart(productId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );

  if (!quantitySelector) {
    return;
  }

  const quantity = Number(quantitySelector.value);
  if (matchingItem) {
    matchingItem.quantity += quantity;
    toast(`Added ${quantity} more items to cart`, 'success');
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: "1",
    });
    toast(`Added ${quantity} items to cart`, 'success');
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  
  cart = newCart;
  toast('Item removed from cart', 'info');
  saveToStorage();
  
  updateCartQuantityDisplay();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });
  
  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    toast('Delivery option updated', 'success');
    saveToStorage();
  }
}

export function updateCartQuantity(productId, newQuantity) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });
  
  if (matchingItem) {
    if (newQuantity > 0 && newQuantity <= 10) {
      matchingItem.quantity = newQuantity;
      toast('Cart quantity updated', 'success');
      saveToStorage();
      
      updateCartQuantityDisplay();
    } else {
      toast('Quantity must be between 1 and 10', 'error');
    }
  }
}

export function getCartTotal() {
  let total = 0;
  cart.forEach((cartItem) => {
    total += cartItem.quantity;
  });
  return total;
}

function updateCartQuantityDisplay() {
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.textContent = getCartTotal();
  }
}

updateCartQuantityDisplay();
