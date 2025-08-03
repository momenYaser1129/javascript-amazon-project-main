// Get current user's cart
function getUserCart() {
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    console.log('No user found in localStorage');
    return [];
  }
  
  const cartKey = `cart_${currentUser.email}`;
  const userCart = localStorage.getItem(cartKey);
  
  if (!userCart) {
    console.log('No cart found for user:', currentUser.email);
    return [];
  }
  
  try {
    const parsedCart = JSON.parse(userCart);
    console.log('Retrieved cart:', parsedCart);
    return parsedCart;
  } catch (error) {
    console.error('Error parsing cart:', error);
    return [];
  }
}

// Initialize cart from storage
export let cart = getUserCart();

function saveToStorage() {
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    console.log('No user found when trying to save cart');
    return;
  }
  
  const cartKey = `cart_${currentUser.email}`;
  try {
    localStorage.setItem(cartKey, JSON.stringify(cart));
    console.log('Saved cart:', cart);
  } catch (error) {
    console.error('Error saving cart:', error);
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
    console.error('Quantity selector not found for product:', productId);
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
  
  // Update cart quantity in header
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
      
      // Update cart quantity in header
      updateCartQuantityDisplay();
    } else {
      toast('Quantity must be between 1 and 10', 'error');
    }
  }
}

// Helper function to get cart total
export function getCartTotal() {
  let total = 0;
  cart.forEach((cartItem) => {
    total += cartItem.quantity;
  });
  return total;
}

// Update cart quantity display in header
function updateCartQuantityDisplay() {
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.textContent = getCartTotal();
  }
}

// Initialize cart quantity display
updateCartQuantityDisplay();
