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

export const orders = getUserOrders();

export function addOrder(order) {
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    return;
  }
  
  const orderWithUser = {
    ...order,
    userId: currentUser.id || currentUser.email,
    userEmail: currentUser.email,
    orderTime: order.orderDate || new Date().toISOString()
  };
  
  orders.unshift(orderWithUser);
  saveToStorage();
}

function saveToStorage() {
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (!currentUser) {
    return;
  }
  
  const ordersKey = `orders_${currentUser.email}`;
  try {
    localStorage.setItem(ordersKey, JSON.stringify(orders));
  } catch (error) {
  }
}

export function refreshOrders() {
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
