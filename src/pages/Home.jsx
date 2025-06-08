import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import Footer from '../components/Footer';
import { menuCategories } from '../data/menuItems.js';

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      
      <Hero />
      <div className="body-section">
        {menuCategories.map(category => (
          <MenuSection key={category} category={category} />
        ))}
      </div>
      <Footer />
    </div>
    
  );
}