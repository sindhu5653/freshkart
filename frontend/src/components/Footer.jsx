import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link to="/" className="footer-logo">FreshKart</Link>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              Your one-stop shop for fresh, organic vegetables delivered straight from farms to your doorstep.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <Facebook size={20} />
              <Instagram size={20} />
              <Twitter size={20} />
            </div>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/shop?category=Leafy">Leafy Greens</Link></li>
              <li><Link to="/shop?category=Roots">Root Vegetables</Link></li>
              <li><Link to="/shop?category=Fruits">Fruits</Link></li>
              <li><Link to="/shop?category=Seasonal">Seasonal</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Contact Info</h4>
            <ul>
              <li style={{ display: 'flex', gap: '10px' }}><MapPin size={18} /> 123 Green Valley, Eco City</li>
              <li style={{ display: 'flex', gap: '10px' }}><Phone size={18} /> +1 234 567 890</li>
              <li style={{ display: 'flex', gap: '10px' }}><Mail size={18} /> hello@freshkart.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FreshKart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
