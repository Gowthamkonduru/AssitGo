import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { startOfToday, endOfToday, startOfYesterday, endOfYesterday, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('today');
  const [billableTables, setBillableTables] = useState([]);

  // --- THIS IS THE FIX ---

  // This function was missing in a previous version, causing warnings.
  const getDatesForPeriod = (period) => {
    switch (period) {
      case 'yesterday': return { start: startOfYesterday(), end: endOfYesterday() };
      case 'this_month': return { start: startOfMonth(new Date()), end: endOfMonth(new Date()) };
      case 'last_month': return { start: startOfMonth(subMonths(new Date(), 1)), end: endOfMonth(subMonths(new Date(), 1)) };
      default: return { start: startOfToday(), end: endOfToday() };
    }
  };

  // Wrap fetchData in useCallback to make it a stable dependency
  const fetchData = useCallback(async (period) => {
    setLoading(true);
    const { start, end } = getDatesForPeriod(period);
    const startDate = start.toISOString();
    const endDate = end.toISOString();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/advanced-stats?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching advanced stats:", error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []); // The empty dependency array means this function is created only once

  const fetchBillableTables = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/active`);
      const activeOrders = await response.json();
      const servedTables = activeOrders.reduce((acc, order) => {
        if (order.status === 'Completed') {
          acc[order.tableNumber] = true;
        }
        return acc;
      }, {});
      setBillableTables(Object.keys(servedTables).map(Number));
    } catch (error) {
      console.error("Error fetching billable tables:", error);
    }
  }, []);

  // The useEffect hook now correctly includes its dependencies
  useEffect(() => {
    fetchData(timePeriod);
    fetchBillableTables();
  }, [timePeriod, fetchData, fetchBillableTables]); // Add fetchData and fetchBillableTables here

  // --- FIX ENDS HERE ---

  const handleMarkAsPaid = async (tableNumber) => {
    if (window.confirm(`Are you sure you want to mark Table ${tableNumber} as paid?`)) {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/orders/table/${tableNumber}/pay`, { method: 'PUT' });
        alert(`Table ${tableNumber} is now available.`);
        fetchBillableTables();
        fetchData(timePeriod);
      } catch (error) {
        console.error("Error marking table as paid:", error);
        alert('An error occurred.');
      }
    }
  };

  const chartOptions = { /* ... (no changes needed) ... */ };
  const topSellingData = { /* ... (no changes needed) ... */ };

  return (
    <div className="admin-dashboard-pro">
      <div className="billing-section">
        <h2>Live Billing</h2>
        <div className="billable-tables-grid">
          {billableTables.length > 0 ? (
            billableTables.map(tableNum => (
              <div key={tableNum} className="billable-card">
                <h4>Table {tableNum}</h4>
                <p>Ready to Pay</p>
                <button onClick={() => handleMarkAsPaid(tableNum)}>Mark as Paid</button>
              </div>
            ))
          ) : (
            <div className="no-bills-message">No tables are currently waiting for payment.</div>
          )}
        </div>
      </div>

      <div className="analytics-section">
        <h2>Restaurant Analytics</h2>
        <div className="time-filters">
          <button onClick={() => setTimePeriod('today')} className={timePeriod === 'today' ? 'active' : ''}>Today</button>
          <button onClick={() => setTimePeriod('yesterday')} className={timePeriod === 'yesterday' ? 'active' : ''}>Yesterday</button>
          <button onClick={() => setTimePeriod('this_month')} className={timePeriod === 'this_month' ? 'active' : ''}>This Month</button>
          <button onClick={() => setTimePeriod('last_month')} className={timePeriod === 'last_month' ? 'active' : ''}>Last Month</button>
        </div>
      </div>
      
      {loading ? ( <div className="loading-state">Loading Analytics...</div> ) :
       !stats ? ( <div className="error-state">Could not load data.</div> ) :
      (
        <>
          <div className="kpi-grid">
            <div className="kpi-card"><h4>Total Revenue</h4><p>₹{stats.totalSales.toFixed(2)}</p></div>
            <div className="kpi-card"><h4>Total Orders</h4><p>{stats.totalOrders}</p></div>
          </div>
          <div className="main-chart-container">
            <div className="chart-card">
              <h3>Top Selling Items</h3>
              <div className="chart-wrapper">
                {stats.topSellingItems && stats.topSellingItems.length > 0 ? (
                  <Bar options={chartOptions} data={topSellingData} />
                ) : (
                  <div className="no-data-message">No items were sold in this period.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;  
