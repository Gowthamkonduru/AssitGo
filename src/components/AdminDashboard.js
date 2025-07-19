import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { startOfToday, endOfToday, startOfYesterday, endOfYesterday, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('today');

  // New state to hold tables that need to be billed
  const [billableTables, setBillableTables] = useState([]);

  useEffect(() => {
    fetchData(timePeriod);
    fetchBillableTables();
  }, [timePeriod]); // This useEffect runs when `timePeriod` changes

  // This function determines the start and end dates based on the selected filter
  const getDatesForPeriod = (period) => {
    switch (period) {
      case 'yesterday':
        return { start: startOfYesterday(), end: endOfYesterday() };
      case 'this_month':
        return { start: startOfMonth(new Date()), end: endOfMonth(new Date()) };
      case 'last_month':
        return { start: startOfMonth(subMonths(new Date(), 1)), end: endOfMonth(subMonths(new Date(), 1)) };
      case 'today':
      default:
        return { start: startOfToday(), end: endOfToday() };
    }
  };

  // This function fetches the main analytics data from the backend
  const fetchData = async (period) => {
    setLoading(true);
    const { start, end } = getDatesForPeriod(period);
    const startDate = start.toISOString();
    const endDate = end.toISOString();
    try {
      const response = await fetch(`http://localhost:8080/admin/advanced-stats?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching advanced stats:", error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // This function fetches tables that are marked as "Served" and ready for billing
  const fetchBillableTables = async () => {
    try {
      const response = await fetch('http://localhost:8080/orders/active');
      const activeOrders = await response.json();

      const servedTables = activeOrders.reduce((acc, order) => {
        if (order.status === 'Completed') {
          acc[order.tableNumber] = (acc[order.tableNumber] || 0) + 1;
        }
        return acc;
      }, {});

      setBillableTables(Object.keys(servedTables).map(Number));
    } catch (error) {
      console.error("Error fetching billable tables:", error);
    }
  };

  // This function handles the "Mark as Paid" button click
  const handleMarkAsPaid = async (tableNumber) => {
    if (window.confirm(`Are you sure you want to mark Table ${tableNumber} as paid?`)) {
      try {
        const response = await fetch(`http://localhost:8080/orders/table/${tableNumber}/pay`, {
          method: 'PUT',
        });
        if (!response.ok) throw new Error('Failed to update status');
        alert(`Table ${tableNumber} is now available.`);
        fetchBillableTables(); // Refresh the billing list
        fetchData(timePeriod); // Refresh the sales stats
      } catch (error) {
        console.error("Error marking table as paid:", error);
        alert('An error occurred.');
      }
    }
  };

  // --- BEGIN REAL-TIME POLLING IMPLEMENTATION ---
  useEffect(() => {
    // Initial fetches when component mounts or timePeriod changes
    fetchData(timePeriod);
    fetchBillableTables();

    // Set up polling for continuous updates
    // Fetch analytics every 15 seconds
    const analyticsInterval = setInterval(() => fetchData(timePeriod), 15000);
    // Fetch billable tables every 5 seconds (can be adjusted)
    const billingInterval = setInterval(fetchBillableTables, 5000);

    // Cleanup function to clear intervals when component unmounts
    return () => {
      clearInterval(analyticsInterval);
      clearInterval(billingInterval);
    };
  }, [timePeriod]); // timePeriod is a dependency here, so the intervals restart if it changes
  // --- END REAL-TIME POLLING IMPLEMENTATION ---

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Top 5 Selling Items by Quantity' }
    },
    scales: { y: { beginAtZero: true } }
  };

  const topSellingData = {
    labels: (stats?.topSellingItems || []).map(item => item.name),
    datasets: [{
      label: 'Quantity Sold',
      data: (stats?.topSellingItems || []).map(item => item.quantitySold),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }],
  };

  return (
    <div className="admin-dashboard-pro">
      {/* --- BILLING SECTION --- */}
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

      {/* --- ANALYTICS SECTION --- */}
      <div className="analytics-section">
        <h2>Restaurant Analytics</h2>
        <div className="time-filters">
          <button onClick={() => setTimePeriod('today')} className={timePeriod === 'today' ? 'active' : ''}>Today</button>
          <button onClick={() => setTimePeriod('yesterday')} className={timePeriod === 'yesterday' ? 'active' : ''}>Yesterday</button>
          <button onClick={() => setTimePeriod('this_month')} className={timePeriod === 'this_month' ? 'active' : ''}>This Month</button>
          <button onClick={() => setTimePeriod('last_month')} className={timePeriod === 'last_month' ? 'active' : ''}>Last Month</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading Analytics...</div>
      ) : !stats ? (
        <div className="error-state">Could not load data.</div>
      ) : (
        <>
          <div className="kpi-grid">
            <div className="kpi-card">
              <h4>Total Revenue</h4>
              <p>₹{stats.totalSales.toFixed(2)}</p>
            </div>
            <div className="kpi-card">
              <h4>Total Orders</h4>
              <p>{stats.totalOrders}</p>
            </div>
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
