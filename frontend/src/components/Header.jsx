import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Leaf, LayoutDashboard, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <Leaf color="#10b981" fill="#10b981" size={28} />
          <span>FreshKart</span>
        </Link>
        <div className="nav-links">
           <Link to="/" className="nav-item">Home</Link>
           <Link to="/shop" className="nav-item">Shop</Link>
           {userInfo && userInfo.role !== 'admin' && (
             <Link to="/my-orders" className="nav-item">My Orders</Link>
           )}
           
           {/* Admin Specific Links */}
           {userInfo && userInfo.role === 'admin' && (
             <>
               <Link to="/admin" className="nav-item admin-link" style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px' }}>
                 <LayoutDashboard size={18} /> Dashboard
               </Link>
               <Link to="/admin/orders" className="nav-item admin-link" style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px' }}>
                 <ShoppingCart size={18} /> Orders
               </Link>
             </>
           )}
        </div>
        <div className="nav-icons">
          <Link to="/shop">
            <Search size={22} />
          </Link>
          {userInfo?.role !== 'admin' && (
            <Link to="/cart" className="cart-icon">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}
          
          {userInfo ? (
            <div className="user-profile-menu">
              <Link to="/profile" className="user-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className={`role-badge ${userInfo.role}`}>{userInfo.role}</span>
                <span className="user-name">{userInfo.name}</span>
              </Link>
              <button onClick={logout} className="logout-btn" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link">
              <User size={22} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
