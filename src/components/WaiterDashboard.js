import React, { useState, useEffect, useCallback } from 'react';
import OrderModal from './OrderModal';
import './WaiterDashboard.css';

function WaiterDashboard() {
  const [tables, setTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const updateTablesWithOrders = (activeOrders) => {
    const tablesArray = Array.from({ length: 10 }, (_, i) => {
      const tableNumber = i + 1;
      const ordersForTable = activeOrders.filter(o => o.tableNumber === tableNumber);
      let status = 'Available';
      if (ordersForTable.length > 0) {
        status = ordersForTable.some(o => o.status === 'Completed') ? 'Served' : 'Waiting for Food';
      }
      return {
        number: tableNumber,
        status: status,
        orders: ordersForTable,
      };
    });
    setTables(tablesArray);
  };

  const fetchMenuItems = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/items');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  }, []);

  const fetchActiveOrders = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/orders/active');
      if (!response.ok) throw new Error('Network response was not ok');
      const activeOrders = await response.json();
      updateTablesWithOrders(activeOrders);
    } catch (error) {
      console.error("Error fetching active orders:", error);
    }
  }, []);

  // --- THIS IS THE FIX FOR REAL-TIME UPDATES ---
  useEffect(() => {
  fetchActiveOrders(); // Initial fetch
  fetchMenuItems();
  const interval = setInterval(fetchActiveOrders, 10000); // Refreshes every 10 seconds
  return () => clearInterval(interval); // Cleanup
}, [fetchActiveOrders, fetchMenuItems]);

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTable(null);
  };

  const handleOrderSubmit = () => {
    fetchActiveOrders(); // Immediately refresh after submitting a new order
    handleCloseModal();
  };

  return (
    <div className="waiter-dashboard">
      <div className="dashboard-header">
        <h1>Live Table Tracking</h1>
        <p>Click on a table to view or place an order.</p>
      </div>
      <div className="dashboard-legend">
        <div className="legend-item">
          <div className="legend-color-box available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-box waiting-for-food"></div>
          <span>Waiting for Food</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-box served"></div>
          <span>Served</span>
        </div>
      </div>
      <div className="tables-grid">
        {tables.map(table => (
          <div
            key={table.number}
            className={`table-card ${table.status.toLowerCase().replace(/ /g, '-')}`}
            onClick={() => handleTableClick(table)}
          >
            <div className="table-card-header">Table-{table.number}</div>
            <div className="table-card-body">{table.status}</div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <OrderModal
          table={selectedTable}
          menuItems={menuItems}
          onClose={handleCloseModal}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
}

export default WaiterDashboard;