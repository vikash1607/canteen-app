import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="hamburger-menu">
          <input type="checkbox" id="toggle" />
          <label htmlFor="toggle">
            <span></span>
            <span></span>
            <span></span>
          </label>
          <ul className="menu-items">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/">Menu</Link></li>
            <li><Link to="/">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="nav-right">
        {user ? (
          <button onClick={logout} className="auth-btn">
            <FiLogOut /> Logout
          </button>
        ) : (
          <Link to="/login" className="auth-btn">
            <FiUser /> Login
          </Link>
        )}
        <Link to="/checkout" className="cart-btn">
          <FiShoppingCart />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </Link>
      </div>
    </nav>
  );
}