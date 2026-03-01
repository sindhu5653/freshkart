import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, ShieldCheck, ChevronLeft, Plus, Minus } from 'lucide-react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '100px' }}>Product not found</div>;

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', color: 'var(--gray)', marginBottom: '30px' }}
      >
        <ChevronLeft size={18} /> Back to store
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '60px' }}>
        <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        <div className="product-details">
          <span className="product-category" style={{ fontSize: '1rem' }}>{product.category}</span>
          <h1 style={{ fontSize: '3rem', margin: '10px 0 20px' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', color: '#fbbf24' }}>
              <Star fill="#fbbf24" size={18} />
              <Star fill="#fbbf24" size={18} />
              <Star fill="#fbbf24" size={18} />
              <Star fill="#fbbf24" size={18} />
              <Star size={18} />
            </div>
            <span style={{ color: 'var(--gray)' }}>(128 Customer Reviews)</span>
          </div>

          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '30px' }}>${product.price} <span style={{ fontSize: '1rem', color: 'var(--gray)', fontWeight: 400 }}> / per kg</span></h2>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--gray)', marginBottom: '40px', lineHeight: 1.8 }}>
            {product.description}
          </p>

          {userInfo?.role !== 'admin' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gray-light)', borderRadius: '12px', padding: '5px' }}>
                <button 
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ padding: '10px', background: 'none' }}
                >
                  <Minus size={18} />
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                <button 
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  style={{ padding: '10px', background: 'none' }}
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <button 
                className="btn btn-primary" 
                style={{ padding: '15px 40px', background: 'var(--primary)', color: 'white', fontSize: '1.1rem' }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--gray-light)', paddingTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck className="text-primary" size={24} style={{ color: 'var(--primary)' }} />
              <div>
                <h4 style={{ fontSize: '0.9rem' }}>Fast Delivery</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Within 24 hours</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={24} style={{ color: 'var(--primary)' }} />
              <div>
                <h4 style={{ fontSize: '0.9rem' }}>Secure Payment</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>100% safe checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
