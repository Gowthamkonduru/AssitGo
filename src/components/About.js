import "./about.css";

function About() {
  return (
    <div className="about container-fluid">
      <h1 className="about-title">About AssitGo</h1>
      <p className="about-intro">
        <strong>AssitGo</strong> is a smart technology-assisted restaurant ordering system designed
        to simplify and enhance the dining experience for customers, waiters, chefs, and owners.
      </p>

      <div className="about-sections">
        <div className="about-card">
          <h3>✨ Waiter Interface</h3>
          <p>
            Easy-to-use tab interface where waiters can quickly select menu items based on the customer's choice and send them directly to the kitchen.
          </p>
        </div>

        <div className="about-card">
          <h3>👨‍🍳 Kitchen Display</h3>
          <p>
            Orders from tables are displayed in real-time to the kitchen staff, reducing communication delays and errors.
          </p>
        </div>

        <div className="about-card">
          <h3>📊 Owner Dashboard</h3>
          <p>
            Provides daily, weekly, and monthly sales tracking. Owners can view performance and make smarter business decisions.
          </p>
        </div>

        <div className="about-card">
          <h3>🚀 Fast, Smart, Efficient</h3>
          <p>
            AssitGo makes the restaurant workflow smooth, saves time, and ensures customer satisfaction through technology.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
