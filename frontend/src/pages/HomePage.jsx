import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, ShieldCheck, Zap } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products.slice(0, 4)); // Show only featured ones
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Fresh Vegetables <br /> <span style={{ color: '#fbbf24' }}>Directly From Farm</span></h1>
            <p>Get the highest quality organic vegetables delivered to your home within 24 hours. No middlemen, just fresh goodness.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to="/shop" className="btn btn-primary">Shop Now</Link>
              <Link to="/about" className="btn" style={{ border: '2px solid white', color: 'white' }}>Learn More</Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-image"
          >
            {/* I will use a placeholder or image generated later. For now, a stylish SVG or div */}
            <div style={{ width: '450px', height: '450px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', backdropFilter: 'blur(20px)', position: 'relative' }}>
               <img 
                 src="https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Fresh Veggies" 
                 style={{ width: '120%', position: 'absolute', top: '10%', right: '-10%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }}
               />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px' }}>
            <div style={{ textAlign: 'center', maxWidth: '250px' }}>
              <div style={{ background: '#ecfdf5', color: '#10b981', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' }}>
                <Truck size={30} />
              </div>
              <h3>Fast Delivery</h3>
              <p style={{ color: '#6b7280' }}>Free shipping on orders over $50. Delivered in 24h.</p>
            </div>
            <div style={{ textAlign: 'center', maxWidth: '250px' }}>
              <div style={{ background: '#fef3c7', color: '#fbbf24', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' }}>
                <ShieldCheck size={30} />
              </div>
              <h3>100% Organic</h3>
              <p style={{ color: '#6b7280' }}>Certified organic vegetables from local farmers.</p>
            </div>
            <div style={{ textAlign: 'center', maxWidth: '250px' }}>
              <div style={{ background: '#eff6ff', color: '#3b82f6', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' }}>
                <Zap size={30} />
              </div>
              <h3>Flash Sales</h3>
              <p style={{ color: '#6b7280' }}>Daily deals and discounts on seasonal produce.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="container">
          <div className="section-title">
            <h2>Featured Products</h2>
            <p>Check out our top-selling fresh vegetables this week.</p>
          </div>
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading products...</p>
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Link to="/shop" className="btn btn-primary" style={{ background: '#1f2937', color: 'white' }}>
                  View All Products <ArrowRight size={18} style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Offers Banner */}
      <section className="container">
        <div style={{ 
          background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1597362868482-48280effec78?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '40px'
        }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Weekly Special Offer</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', maxWidth: '600px' }}>Get 30% off on all seasonal fruits and leafy greens this weekend. Use code: FRESH30</p>
          <Link to="/shop" className="btn btn-primary">Grab Deal Now</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
