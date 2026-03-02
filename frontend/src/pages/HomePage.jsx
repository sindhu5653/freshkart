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
        setProducts(data.products.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ overflowX: 'hidden' }}>
      
      {/* ================= HERO SECTION ================= */}
      <section style={{ padding: '50px 20px', background: '#20df76f8', color: 'white' }}>
        <div 
          style={{
            maxWidth: '1200px',
            margin: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '40px'
          }}
        >

          {/* Left Content */}
          <motion.div
            style={{ flex: '1 1 450px' }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
              fontWeight: 'bold',
              lineHeight: '1.2'
            }}>
              Fresh Vegetables <br />
              <span style={{ color: '#fbbf24' }}>Directly From Farm</span>
            </h1>

            <p style={{ marginTop: '20px', fontSize: '1.1rem', maxWidth: '500px' }}>
              Get the highest quality organic vegetables delivered to your home within 24 hours.
              No middlemen, just fresh goodness.
            </p>

            <div style={{ 
              marginTop: '30px',
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <Link to="/shop" className="btn btn-primary">
                Shop Now
              </Link>
              <Link 
                to="/about" 
                style={{
                  padding: '10px 20px',
                  border: '2px solid white',
                  borderRadius: '8px',
                  color: 'white',
                  textDecoration: 'none'
                }}
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            style={{ flex: '1 1 350px', display: 'flex', justifyContent: 'center' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ 
              width: '100%',
              maxWidth: '400px',
              aspectRatio: '1/1',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999"
                alt="Fresh Veggies"
                style={{ 
                  width: '100%',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))'
                }}
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section style={{ padding: '60px 20px', background: 'white' }}>
        <div style={{ 
          maxWidth: '1100px',
          margin: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '40px'
        }}>
          
          {[ 
            { icon: <Truck size={30} />, title: 'Fast Delivery', text: 'Free shipping on orders over $50. Delivered in 24h.', bg: '#ecfdf5', color: '#10b981' },
            { icon: <ShieldCheck size={30} />, title: '100% Organic', text: 'Certified organic vegetables from local farmers.', bg: '#fef3c7', color: '#fbbf24' },
            { icon: <Zap size={30} />, title: 'Flash Sales', text: 'Daily deals and discounts on seasonal produce.', bg: '#eff6ff', color: '#3b82f6' }
          ].map((feature, index) => (
            <div key={index} style={{ 
              flex: '1 1 250px',
              maxWidth: '300px',
              textAlign: 'center'
            }}>
              <div style={{ 
                background: feature.bg,
                color: feature.color,
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto 20px'
              }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p style={{ color: '#6b7280', marginTop: '10px' }}>{feature.text}</p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: 'auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 'bold' }}>
              Featured Products
            </h2>
            <p style={{ color: '#6b7280', marginTop: '10px' }}>
              Check out our top-selling fresh vegetables this week.
            </p>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading products...</p>
          ) : (
            <>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '30px'
              }}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link 
                  to="/shop"
                  style={{
                    background: '#1f2937',
                    color: 'white',
                    padding: '12px 25px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  View All Products
                  <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================= OFFER BANNER ================= */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: 'auto',
          borderRadius: '20px',
          padding: '60px 20px',
          textAlign: 'center',
          color: 'white',
          background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1597362868482-48280effec78)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', marginBottom: '20px' }}>
            Weekly Special Offer
          </h2>
          <p style={{ maxWidth: '600px', margin: 'auto auto 30px' }}>
            Get 30% off on all seasonal fruits and leafy greens this weekend.
            Use code: FRESH30
          </p>
          <Link to="/shop" className="btn btn-primary">
            Grab Deal Now
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
