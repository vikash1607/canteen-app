import { useCart } from '../context/CartContext';

export default function CartModal({ onClose }) {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    totalPrice,
    clearCart
  } = useCart();

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(itemId);
    }
  };

  const handleQuantityChange = (id, change) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="cart-modal">
      <div className="cart-modal-content">
        <button className="close-cart" onClick={onClose}>&times;</button>
        <h2>Your Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h2>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price}</p>
                  
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>
                      +
                    </button>
                  </div>
                  
                  <button 
                    className="remove-item"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Remove item"
                  >
                    <span className="trash-icon">🗑️</span> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <>
            <div className="cart-summary">
              <div className="cart-total">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <button 
                className="clear-cart"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your cart?')) {
                    clearCart();
                  }
                }}
              >
                Clear Cart
              </button>
            </div>

            <button className="checkout-btn">
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}