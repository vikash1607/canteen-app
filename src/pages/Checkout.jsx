import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // In a real app, you would process payment here
    alert('Order placed successfully!');
    clearCart();
    navigate('/');
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="order-item">
            <span>{item.name}</span>
            <span>₹{item.price} x {item.quantity}</span>
          </div>
        ))}
        <div className="order-total">
          <span>Total:</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <div className="payment-section">
        <h2>Payment Method</h2>
        <div className="payment-options">
          <label>
            <input type="radio" name="payment" defaultChecked /> Credit Card
          </label>
          <label>
            <input type="radio" name="payment" /> UPI
          </label>
          <label>
            <input type="radio" name="payment" /> Cash on Delivery
          </label>
        </div>
      </div>
      <button 
        className="place-order-btn"
        onClick={handleCheckout}
        disabled={!user || cart.length === 0}
      >
        Place Order
      </button>
    </div>
  );
}