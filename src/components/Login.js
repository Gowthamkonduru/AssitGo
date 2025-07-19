import { Link } from "react-router-dom";
import "./login.css";

function Login() {
  return (
    <div className="container py-5 login">
      <h2 className="text-center mb-5">Login Options</h2>
      <div className="row g-4 justify-content-center">

        {/* Waiter */}
        <div className="waiter col-12 col-sm-6 col-md-4">
          <div className="card shadow-lg h-100">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">Login as Waiter</h4>
              <ul className="card-text">
                <li>Take & manage customer orders</li>
                <li>Update table status</li>
                <li>Send orders to kitchen</li>
              </ul>
            </div>
            <div className="card-footer bg-transparent text-center">
              <Link to="/LoginWaiter" className="btn btn-primary">Login as Waiter</Link>
            </div>
          </div>
        </div>

        {/* Chef */}
        <div className="cheif col-12 col-sm-6 col-md-4">
          <div className="card shadow-lg h-100">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">Login as Chef</h4>
              <ul className="card-text">
                <li>View live incoming orders</li>
                <li>Update preparation status</li>
                <li>Notify when ready</li>
              </ul>
            </div>
            <div className="card-footer bg-transparent text-center">
              <Link to="/LoginChef" className="btn btn-warning">Login as Chef</Link>
            </div>
          </div>
        </div>

        {/* Admin */}
        <div className="admin col-12 col-sm-6 col-md-4">
          <div className="card shadow-lg h-100">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">Login as Admin</h4>
              <ul className="card-text">
                <li>Track restaurant performance</li>
                <li>Manage users and roles</li>
                <li>Access detailed reports</li>
              </ul>
            </div>
            <div className="card-footer bg-transparent text-center">
              <Link to="/LoginAdmin" className="btn btn-danger">Login as Admin</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;


