import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './components/AuthContext';

// Import all your components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login"; // The page with the three cards
import { LoginWaiter, LoginChef, LoginAdmin } from "./components/LoginForms"; // The actual login form components
import WaiterDashboard from './components/WaiterDashboard';
import ChefDashboard from './components/ChefDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Main navigation routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Route to the page with the three login options */}
          <Route path="/login" element={<Login />} />

          {/* --- THESE ARE THE MISSING ROUTES --- */}
          {/* Add these routes to render the specific login forms */}
          <Route path="/LoginWaiter" element={<LoginWaiter />} />
          <Route path="/LoginChef" element={<LoginChef />} />
          <Route path="/LoginAdmin" element={<LoginAdmin />} />

          {/* Dashboard routes */}
          <Route path="/waiter-dashboard" element={<WaiterDashboard />} />
          <Route path="/chef-dashboard" element={<ChefDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;