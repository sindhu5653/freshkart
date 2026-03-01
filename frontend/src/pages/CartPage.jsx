import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.role === 'admin') {
      navigate('/admin');
    }
  }, [userInfo, navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <h1 style={{ marginBottom: '40px' }}>Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
          <ShoppingBag size={80} style={{ color: 'var(--gray-light)', marginBottom: '20px' }} />
          <h2>Your cart is empty</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '30px' }}>Looks like you haven't added any fresh veggies yet.</p>
          <Link to="/shop" className="btn btn-primary" style={{ background: 'var(--primary)', color: 'white' }}>Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h3 style={{ marginBottom: '5px' }}>{item.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 600 }}>${item.price.toFixed(2)} / kg</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gray-light)', borderRadius: '8px', padding: '2px', marginRight: '30px' }}>
                  <button 
                    onClick={() => addToCart({ _id: item.product, ...item }, Math.max(1, item.qty - 1))}
                    style={{ padding: '5px', background: 'none' }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ width: '30px', textAlign: 'center' }}>{item.qty}</span>
                  <button 
                    onClick={() => addToCart({ _id: item.product, ...item }, Math.min(item.stock, item.qty + 1))}
                    style={{ padding: '5px', background: 'none' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div style={{ fontWeight: 700, minWidth: '80px' }}>
                  ${(item.qty * item.price).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeFromCart(item.product)}
                  style={{ background: 'none', color: '#ef4444', marginLeft: '20px' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            <Link to="/shop" style={{ display: 'inline-block', marginTop: '30px', color: 'var(--primary)', fontWeight: 600 }}>
              &larr; Continue Shopping
            </Link>
          </div>

          <div className="cart-summary">
            <h3 style={{ marginBottom: '25px' }}>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--gray-light)', fontWeight: 700, fontSize: '1.2rem' }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button 
              className="btn btn-primary btn-block" 
              style={{ background: 'var(--primary)', color: 'white', marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
              onClick={checkoutHandler}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            
            {shipping > 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '15px', textAlign: 'center' }}>
                Add ${(50 - subtotal).toFixed(2)} more to get FREE shipping!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
