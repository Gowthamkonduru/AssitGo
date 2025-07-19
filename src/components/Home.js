import "./Home.css";
import Footer from "./footer";

function Home() {
  return (
    <>
    <div className="home container-fluid">
      <div className="row align-items-center justify-content-center">
        
        <div className="col-md-6 text-center mb-4">
          <div className="home-logo p-3">
            <img src="logo.png" className="logo-img img-fluid" alt="AssitGo Logo" />
            <h5 className="logo-subtitle mt-2">Your Digital Assistant for Smarter Dining</h5>
          </div>
        </div>

        <div className="col-md-6 text-white text-start home-summary">
          <h2 className="summary-heading">Why Choose AssitGo?</h2>
          <p>✦ Smart Ordering System</p>
          <p>✦ Waiter-friendly Interface</p>
          <p>✦ Kitchen Gets Orders Instantly</p>
          <p>✦ Admin Can Track Sales</p>
          <p>✦ Fast, Simple, Efficient.</p>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}

export default Home;
