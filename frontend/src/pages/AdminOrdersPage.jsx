import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { ShoppingCart, Clock, Package, Truck, CheckCircle, Users, DollarSign, X, MapPin, CreditCard, Mail, Phone, Calendar } from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orderRes, prodRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products')
      ]);
      setOrders(orderRes.data);
      setProducts(prodRes.data.products);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return { background: '#fef3c7', color: '#f59e0b' };
      case 'Packing': return { background: '#dbeafe', color: '#3b82f6' };
      case 'Processing': return { background: '#ede9fe', color: '#8b5cf6' };
      case 'Delivered': return { background: '#ecfdf5', color: '#10b981' };
      default: return { background: '#f3f4f6', color: '#6b7280' };
    }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading Admin Orders...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <ShoppingCart size={32} color="var(--primary)" /> Customer Orders
        </h1>
      </div>

      {/* Stats Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {[
          { icon: <Package />, label: 'Total Products', value: products.length, color: '#10b981' },
          { icon: <ShoppingCart />, label: 'Total Orders', value: orders.length, color: '#fbbf24' },
          { icon: <DollarSign />, label: 'Revenue', value: `$${orders.reduce((acc, o) => acc + o.totalPrice, 0).toFixed(2)}`, color: '#3b82f6' },
          { icon: <Users />, label: 'Customers', value: new Set(orders.map(o => o.user?._id).filter(id => id)).size, color: '#a855f7' }
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ color: stat.color, background: `${stat.color}15`, padding: '10px', borderRadius: '12px' }}>{stat.icon}</div>
            <div>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--gray-light)' }}>
              <th style={{ padding: '15px 10px' }}>Order ID</th>
              <th style={{ padding: '15px 10px' }}>Customer</th>
              <th style={{ padding: '15px 10px' }}>Items</th>
              <th style={{ padding: '15px 10px' }}>Total Amount</th>
              <th style={{ padding: '15px 10px' }}>Current Status</th>
              <th style={{ padding: '15px 10px' }}>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const statusStyle = getStatusStyle(order.status);
              return (
                <tr 
                  key={order._id} 
                  style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background 0.2s' }}
                  onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <td style={{ padding: '15px 10px', fontWeight: 600 }}>#{order._id.slice(-6)}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ fontWeight: 500 }}>{order.user?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      {order.orderItems.map((item, idx) => (
                        <div key={idx}>{item.qty}x {item.name}</div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '15px 10px', fontWeight: 700 }}>${order.totalPrice.toFixed(2)}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      ...statusStyle
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px 10px' }} onClick={(e) => e.stopPropagation()}>
                    <select 
                      value={order.status}
                      onChange={async (e) => {
                        try {
                          await api.put('/orders/status', { 
                            orderId: order._id, 
                            status: e.target.value 
                          });
                          toast.success('Order status updated');
                          fetchData();
                        } catch (err) {
                          const message = err.response && err.response.data.message
                            ? err.response.data.message
                            : err.message;
                          toast.error(`Error updating status: ${message}`);
                        }
                      }}
                      style={{ 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        border: '1px solid var(--gray-light)', 
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Packing">Packing</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray)' }}>
            No customer orders found yet.
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '20px' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <button 
              onClick={() => { setShowModal(false); setSelectedOrder(null); }}
              style={{ position: 'absolute', right: '30px', top: '30px', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--gray)' }}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '30px' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Order Details</span>
              <h2 style={{ fontSize: '2rem', marginTop: '5px' }}>Order #{selectedOrder._id.slice(-8)}</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
              {/* Left Column: Customer & Shipping */}
              <div>
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--gray)' }}>
                    <Users size={18} /> Customer Information
                  </h4>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedOrder.user?.name}</p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)', marginTop: '8px' }}>
                    <Mail size={14} /> {selectedOrder.user?.email}
                  </p>
                  {selectedOrder.user?.phone && (
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)', marginTop: '5px' }}>
                      <Phone size={14} /> {selectedOrder.user?.phone}
                    </p>
                  )}
                </div>

                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--gray)' }}>
                    <MapPin size={18} /> Shipping Address
                  </h4>
                  <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                    <p style={{ fontWeight: 500, lineHeight: 1.6 }}>
                      {selectedOrder.shippingAddress.address}<br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}<br />
                      {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Stats & Payment */}
              <div>
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--gray)' }}>
                    <Clock size={18} /> Order Status
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ 
                      padding: '8px 20px', 
                      borderRadius: '12px', 
                      fontSize: '0.9rem', 
                      fontWeight: 700,
                      ...getStatusStyle(selectedOrder.status)
                    }}>
                      {selectedOrder.status}
                    </span>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)', fontSize: '0.85rem' }}>
                      <Calendar size={14} /> Ordered on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--gray)' }}>
                    <CreditCard size={18} /> Payment Information
                  </h4>
                  <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: 'var(--gray)' }}>Method:</span>
                      <span style={{ fontWeight: 600 }}>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--gray)' }}>Total Amount:</span>
                      <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>${selectedOrder.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--gray)' }}>
                <Package size={18} /> Ordered Items
              </h4>
              <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f9fafb' }}>
                    <tr style={{ textAlign: 'left' }}>
                      <th style={{ padding: '15px 20px', fontSize: '0.85rem', color: 'var(--gray)' }}>Product</th>
                      <th style={{ padding: '15px 20px', fontSize: '0.85rem', color: 'var(--gray)', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '15px 20px', fontSize: '0.85rem', color: 'var(--gray)', textAlign: 'right' }}>Price</th>
                      <th style={{ padding: '15px 20px', fontSize: '0.85rem', color: 'var(--gray)', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems.map((item, idx) => (
                      <tr key={idx} style={{ borderTop: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '15px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                            <span style={{ fontWeight: 500 }}>{item.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '15px 20px', textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ padding: '15px 20px', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                        <td style={{ padding: '15px 20px', textAlign: 'right', fontWeight: 600 }}>${(item.qty * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
