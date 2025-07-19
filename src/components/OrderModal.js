import React, { useState } from 'react';
import './OrderModal.css';

function OrderModal({ table, menuItems, onClose, onSubmit }) {
  const [currentOrder, setCurrentOrder] = useState({}); // Stores { itemId: quantity }

  // Function to add or remove items from the current order
  const handleQuantityChange = (itemId, change) => {
    setCurrentOrder(prevOrder => {
      const newQuantity = (prevOrder[itemId] || 0) + change;
      if (newQuantity > 0) {
        return { ...prevOrder, [itemId]: newQuantity };
      } else {
        const { [itemId]: _, ...rest } = prevOrder; // Remove item if quantity is 0
        return rest;
      }
    });
  };

  // Submits the new order to the backend
  const handleSubmitOrder = async () => {
    const orderPayload = Object.keys(currentOrder).map(itemId => ({
      tableNumber: table.number,
      itemId: parseInt(itemId),
      quantity: currentOrder[itemId],
      status: "Waiting for Food", // Initial status for new orders
      waiterId: 1, // This should ideally come from the logged-in user's state (useAuth hook)
    }));

    if (orderPayload.length === 0) {
      alert("Please add at least one item to the order.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      alert(`Order for Table ${table.number} has been submitted!`);
      onSubmit(); // Trigger the dashboard to refresh
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("An error occurred while submitting the order.");
    }
  };
  
  // Helper to get an item's name from its ID for display
  const getMenuItemName = (itemId) => {
    const item = menuItems.find(mi => mi.id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Table {table.number}</h2>
        
        {/* If table is NOT available, show the details of the existing order */}
        {table.status !== 'Available' && (
          <div className="existing-order-view">
            <h4>Current Order (Status: {table.status})</h4>
            <ul className="order-item-list">
              {table.orders.map(order => (
                <li key={order.id}>
                  <span>{getMenuItemName(order.itemId)}</span>
                  <span>Qty: {order.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* If table IS available, show the menu to create a new order */}
        {table.status === 'Available' && (
          <div className="new-order-view">
            <h4>Place a New Order</h4>
            <div className="menu-items-list">
              {menuItems.map(item => (
                <div key={item.id} className="menu-item">
                  <span className="item-name">{item.name} (₹{item.price.toFixed(2)})</span>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span>{currentOrder[item.id] || 0}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="submit-order-btn" onClick={handleSubmitOrder}>
              Submit Order to Kitchen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderModal;