export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>College Canteen</h3>
          <p>
            Serving fresh, delicious, and affordable meals for students and faculty.
            Powered by passion, hygiene, and innovation.
          </p>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Menu</a></li>
            <li><a href="#">Offers</a></li>
            <li><a href="#">Login</a></li>
          </ul>
        </div>

        <div className="footer-section services">
          <h4>Our Services</h4>
          <ul>
            <li><a href="#">Breakfast & Lunch</a></li>
            <li><a href="#">Snacks & Coolers</a></li>
            <li><a href="#">Online Orders</a></li>
            <li><a href="#">Event Catering</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <p>Email: support@canteeno.edu</p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: KIIT Campus, Bhubaneswar, India</p>
        </div>

        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i> Facebook</a>
            <a href="#"><i className="fab fa-instagram"></i> Instagram</a>
            <a href="#"><i className="fab fa-twitter"></i> Twitter</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 College Canteen. All rights reserved.</p>
      </div>
    </footer>
  );
}
