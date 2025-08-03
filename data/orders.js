function getUserOrders() {
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    return [];
  }
  
  const ordersKey = `orders_${currentUser.email}`;
  const userOrders = localStorage.getItem(ordersKey);
  
  if (!userOrders) {
    return [];
  }
  
  try {
    const parsedOrders = JSON.parse(userOrders);
    return parsedOrders;
  } catch (error) {
    return [];
  }
}

// Initialize orders array
let orders = [];

// Initialize orders on module load
function initializeOrders() {
  orders = getUserOrders();
}

initializeOrders();

// Export orders array for debugging
export function getOrders() {
  return orders;
}

export function addOrder(order) {
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    console.error('No user found when trying to add order');
    return;
  }
  
  if (!order || !order.cart || !Array.isArray(order.cart)) {
    console.error('Invalid order data:', order);
    return;
  }
  
  const orderWithUser = {
    ...order,
    userId: currentUser.id || currentUser.email,
    userEmail: currentUser.email,
    orderTime: order.orderDate || new Date().toISOString(),
    id: order.id || Date.now().toString()
  };
  
  // Refresh orders array before adding new order
  orders = getUserOrders();
  orders.unshift(orderWithUser);
  saveToStorage();
}

function saveToStorage() {
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    console.error('No user found when trying to save orders');
    return;
  }
  
  const ordersKey = `orders_${currentUser.email}`;
  try {
    localStorage.setItem(ordersKey, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
}

export function refreshOrders() {
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    console.error('No user found when trying to refresh orders');
    return [];
  }
  
  const ordersKey = `orders_${currentUser.email}`;
  const userOrders = localStorage.getItem(ordersKey);
  
  if (!userOrders) {
    return [];
  }
  
  try {
    const parsedOrders = JSON.parse(userOrders);
    if (!Array.isArray(parsedOrders)) {
      console.error('Orders data is not an array:', parsedOrders);
      return [];
    }
    return parsedOrders;
  } catch (error) {
    console.error('Error parsing orders from localStorage:', error);
    return [];
  }
}
