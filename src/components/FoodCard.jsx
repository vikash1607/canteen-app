import { useCart } from '../context/CartContext';

export default function FoodCard({ id, name, price, image, description }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt={name} />
      </div>
      <div className="card-text">
        <p className="card-meal-type">{name}</p>
        <h2 className="card-title">{name}</h2>
        <p className="card-body">{description}</p>
      </div>
      <div className="card-price">₹{price}</div>
      <button 
        className="add-to-cart"
        onClick={() => addToCart({ id, name, price, image })}
      >
        Add to Cart
      </button>
    </div>
  );
}