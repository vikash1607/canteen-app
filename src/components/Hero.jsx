import TypewriterEffect from './TypewriterEffect';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="part1">
        <div className="hero-text">
          <h1>CANTEENO</h1>
          <TypewriterEffect />
        </div>
        <div className="hero-img">
          <img src="/images/pngegg.png" alt="Food illustration" />
        </div>
      </div>
      <div className="part2">
        <button className="btn" id="btn1">Order Now</button>
        <button className="btn" id="btn2">View Menu</button>
      </div>
    </section>
  );
}