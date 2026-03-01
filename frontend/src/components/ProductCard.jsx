import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} className="product-image" />
      </Link>
      {userInfo?.role !== 'admin' && (
        <button 
          className="add-to-cart-btn"
          onClick={() => addToCart(product, 1)}
        >
          <ShoppingCart size={18} />
        </button>
      )}
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-price">${product.price}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: '#fbbf24' }}>
            <Star size={14} fill="#fbbf24" />
            <span style={{ color: '#6b7280' }}>4.5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
