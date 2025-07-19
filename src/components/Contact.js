import './contact.css';

function Contact() {

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>Have questions or feedback? Reach out directly via email.</p>
      <a className='contact'
    href="https://mail.google.com/mail/?view=cm&to=gowthamkonduru33@gmail.com" 
    target="_blank" 
    rel="noopener noreferrer">
        Email Us
    </a>
    <img className='contact_us-img' src='contact_us-img.png' alt="Illustration of a person using a laptop to send a message"/>

    </div>
  );    
}

export default Contact;

