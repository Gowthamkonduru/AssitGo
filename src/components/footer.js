import "./footer.css"
function Footer() {
  return (
    <div className="footer-wrapper">
      <div className="footer-about">
        <img src="gowtham.jpg" alt="Gowtham" className="footer-photo" />
        <div className="footer-text">
          <h3>About the Developer</h3>
          <p>
            Hi, I’m Gowtham – a passionate student developer who built AssitGo to simplify the restaurant ordering experience. I enjoy learning new technologies and building real-world projects that solve problems smartly and efficiently.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AssitGo. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
