// Initialize orders array safely
let orders = [];

// Load orders from localStorage safely
function loadOrdersFromStorage() {
  try {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      orders = JSON.parse(storedOrders);
    }
  } catch (error) {
    console.error('Error loading orders from localStorage:', error);
    orders = [];
  }
}

// Load orders on module initialization
loadOrdersFromStorage();

export { orders };

export function addOrder(order) {
  // Get current user and add userId to the order
  const currentUser = JSON.parse(localStorage.getItem('signedUser'));
  if (currentUser) {
    order.userId = currentUser.email; // Use email as user identifier
  }
  
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  try {
    localStorage.setItem('orders', JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
}
