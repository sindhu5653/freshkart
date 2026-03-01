import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { CreditCard, MapPin, CheckCircle, Wallet, Truck, CreditCard as CardIcon } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const passedAddress = location.state?.selectedAddress;

  const [address, setAddress] = useState(passedAddress?.address || '');
  const [city, setCity] = useState(passedAddress?.city || '');
  const [postalCode, setPostalCode] = useState(passedAddress?.postalCode || '');
  const [country, setCountry] = useState(passedAddress?.country || '');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(!!passedAddress || userInfo?.addresses?.length > 0);

  // Demo Card States
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success'); // 'success' or 'payment'

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/shop');
    }

    // Set default initial address from saved if available and not passed from state
    if (userInfo?.addresses?.length > 0 && !address && !passedAddress) {
      const def = userInfo.addresses.find(a => a.isDefault) || userInfo.addresses[0];
      setAddress(def.address);
      setCity(def.city);
      setPostalCode(def.postalCode);
      setCountry(def.country);
    }
  }, [userInfo, cartItems.length, navigate, address, passedAddress]);

  const selectAddressHandler = (addr) => {
    setAddress(addr.address);
    setCity(addr.city);
    setPostalCode(addr.postalCode);
    setCountry(addr.country);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment validation for Online Payment
    if (paymentMethod === 'Online Payment') {
      if (cardNumber.length < 16 || expiry.length < 5 || cvc.length < 3) {
        toast.error('Please fill in valid demo card details');
        setLoading(false);
        return;
      }
    }

    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: 0,
        totalPrice: total,
      };

      // Simulate network delay for "processing payment"
      if (paymentMethod === 'Online Payment') {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      await api.post('/orders', orderData);
      
      if (paymentMethod === 'Online Payment') {
        setModalType('payment');
        setModalMessage('amount transfered. payment successfull');
        setShowModal(true);
        
        // Wait then show order success
        setTimeout(() => {
          setModalType('success');
          setModalMessage('Order confirmed. you item will deliver soon');
          
          setTimeout(() => {
            clearCart();
            navigate('/');
          }, 2500);
        }, 2000);
      } else {
        setModalType('success');
        setModalMessage('Order confirmed. you item will deliver soon');
        setShowModal(true);
        
        setTimeout(() => {
          clearCart();
          navigate('/');
        }, 2500);
      }
    } catch (error) {
      setLoading(false);
      toast.error('Error placing order');
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <h1 style={{ marginBottom: '40px' }}>Checkout</h1>
      
      {/* Custom Animated Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ marginBottom: '20px' }}>
              {modalType === 'payment' ? (
                <CreditCard size={60} color="var(--primary)" style={{ margin: '0 auto' }} />
              ) : (
                <CheckCircle size={60} color="var(--primary)" style={{ margin: '0 auto' }} />
              )}
            </div>
            <h2 style={{ marginBottom: '10px' }}>{modalType === 'payment' ? 'Payment Successful' : 'Success!'}</h2>
            <p style={{ color: 'var(--gray)', fontSize: '1.1rem' }}>{modalMessage}</p>
          </div>
        </div>
      )}

      <div className="cart-grid">
        <form onSubmit={placeOrderHandler} style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <MapPin size={22} color="var(--primary)" /> Shipping Address
          </h3>

          {userInfo?.addresses?.length > 0 && (
            <div style={{ marginBottom: '25px', padding: '15px', background: '#f9fafb', borderRadius: '12px', border: '1px solid var(--gray-light)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, cursor: 'pointer', marginBottom: '15px' }}>
                <input type="checkbox" checked={useSavedAddress} onChange={() => setUseSavedAddress(!useSavedAddress)} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                Use a saved address
              </label>

              {useSavedAddress && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {userInfo.addresses.map((addr, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => selectAddressHandler(addr)}
                      style={{ 
                        padding: '10px', 
                        borderRadius: '8px', 
                        border: '2px solid',
                        borderColor: address === addr.address ? 'var(--primary)' : 'var(--gray-light)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        background: address === addr.address ? '#f0fdf4' : 'white'
                      }}
                    >
                      <strong>{addr.address}</strong>, {addr.city}, {addr.postalCode}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="form-group">
            <label>Address</label>
            <input type="text" placeholder="Enter address" value={address} onChange={(e) => { setAddress(e.target.value); setUseSavedAddress(false); }} required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>City</label>
              <input type="text" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input type="text" placeholder="Enter postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
            </div>
          </div>
          
          <div className="form-group">
            <label>Country</label>
            <input type="text" placeholder="Enter country" value={country} onChange={(e) => setCountry(e.target.value)} required />
          </div>

          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '40px 0 25px' }}>
            <Wallet size={22} color="var(--primary)" /> Payment Method
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'Cash on Delivery', icon: <Truck size={20} />, label: 'Cash on Delivery' },
              { id: 'Card on Delivery', icon: <CardIcon size={20} />, label: 'Card on Delivery' },
              { id: 'Online Payment', icon: <CreditCard size={20} />, label: 'Online Payment' }
            ].map((method) => (
              <div key={method.id}>
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '15px',
                    border: '2px solid',
                    borderColor: paymentMethod === method.id ? 'var(--primary)' : 'var(--gray-light)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: paymentMethod === method.id ? '#f0fdf4' : 'white',
                    transition: 'var(--transition)'
                  }}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value={method.id} 
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}>
                    {method.icon} {method.label}
                  </span>
                </label>

                {paymentMethod === 'Online Payment' && method.id === 'Online Payment' && (
                  <div style={{ marginTop: '15px', padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '1px solid var(--gray-light)', animation: 'fadeIn 0.3s ease-out' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.85rem' }}>Card Number</label>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                        style={{ background: 'white' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.85rem' }}>Expiry (MM/YY)</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          value={expiry} 
                          onChange={(e) => setExpiry(e.target.value.substring(0, 5))}
                          style={{ background: 'white' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.85rem' }}>CVC</label>
                        <input 
                          type="text" 
                          placeholder="000" 
                          value={cvc} 
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                          style={{ background: 'white' }}
                        />
                      </div>
                    </div>
                    <p style={{ marginTop: '15px', fontSize: '0.75rem', color: 'var(--gray)', textAlign: 'center' }}>
                      Demo Account: Use any numbers for card details.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={loading}
            style={{ marginTop: '40px', background: 'var(--primary)', color: 'white', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Processing...' : 'Place Your Order'}
          </button>
        </form>

        <div className="cart-summary">
          <h3 style={{ marginBottom: '25px' }}>Your Bill</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
            {cartItems.map(item => (
              <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem' }}>
                <span>{item.name} x {item.qty}</span>
                <span>${(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-row" style={{ paddingTop: '20px', borderTop: '1px solid var(--gray-light)' }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--gray-light)', fontWeight: 700, fontSize: '1.2rem' }}>
            <span>Total Amount</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
