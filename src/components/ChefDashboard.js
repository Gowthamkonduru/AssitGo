import React, { useState, useEffect } from 'react';
import './ChefDashboard.css';

function ChefDashboard() {
  const [waitingOrders, setWaitingOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
  fetchWaitingOrders(); // Initial fetch
  fetchMenuItems();
  const interval = setInterval(fetchWaitingOrders, 10000); // Refreshes every 10 seconds
  return () => clearInterval(interval); // Cleanup
}, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/items');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const fetchWaitingOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/orders/waiting');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      const groupedOrders = data.reduce((acc, order) => {
        (acc[order.tableNumber] = acc[order.tableNumber] || []).push(order);
        return acc;
      }, {});
      setWaitingOrders(Object.values(groupedOrders));

    } catch (error) {
      console.error("Error fetching waiting orders:", error);
    }
  };

  const handleMarkAsReady = async (orders) => {
    try {
      for (const order of orders) {
        const response = await fetch(`http://localhost:8080/orders/${order.id}/complete`, {
          method: 'PUT',
        });
        if (!response.ok) {
          throw new Error(`Failed to update order ${order.id}`);
        }
      }
      alert(`Order for Table ${orders[0].tableNumber} marked as completed!`);
      fetchWaitingOrders();
    } catch (error) {
      console.error("Error marking order as ready:", error);
      alert("An error occurred while updating the order status.");
    }
  };
  
  const getMenuItemName = (itemId) => {
    const item = menuItems.find(mi => mi.id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  return (
    <div className="chef-dashboard">
      <div className="chef-dashboard-header">
        <h1>Incoming Orders</h1>
        <p>Orders from waiters will appear here in real-time.</p>
      </div>

      <div className="order-grid">
        {waitingOrders.length > 0 ? (
          waitingOrders.map((orderGroup, index) => (
            <div key={index} className="order-card">
              <div className="order-card-header">
                <h3>Table {orderGroup[0].tableNumber}</h3>
              </div>
              <div className="order-card-body">
                <ul className="item-list">
                  {orderGroup.map(order => (
                    <li key={order.id}>
                      <span className="item-name">{getMenuItemName(order.itemId)}</span>
                      <span className="item-quantity">x {order.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-card-footer">
                <button
                  className="ready-btn"
                  onClick={() => handleMarkAsReady(orderGroup)}
                >
                  Mark as Ready
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-orders-message">
            <p>No pending orders. Waiting for the next one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChefDashboard;