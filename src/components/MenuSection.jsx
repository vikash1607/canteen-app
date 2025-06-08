import FoodCard from './FoodCard';
import { menuItems } from '../data/menuItems';

export default function MenuSection({ category }) {
  const filteredItems = menuItems.filter(item => item.category === category);

  return (
    <section className="menu-section">
      <div className="header">
        <h1>{category}</h1>
        <p>The Traditional Andhra Taste</p>
      </div>
      <div className="container">
        {filteredItems.map(item => (
          <FoodCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}