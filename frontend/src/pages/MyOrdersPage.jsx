import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const MyOrdersPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return { color: '#f59e0b', bg: '#fef3c7' };
      case 'Packing': return { color: '#3b82f6', bg: '#dbeafe' };
      case 'Processing': return { color: '#8b5cf6', bg: '#ede9fe' };
      case 'Delivered': return { color: '#10b981', bg: '#ecfdf5' };
      default: return { color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={16} />;
      case 'Packing': return <Package size={16} />;
      case 'Processing': return <Truck size={16} />;
      case 'Delivered': return <CheckCircle size={16} />;
      default: return null;
    }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading your orders...</div>;

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <h1 style={{ marginBottom: '40px' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
          <Package size={60} style={{ color: 'var(--gray-light)', marginBottom: '20px' }} />
          <h3>No orders yet</h3>
          <p style={{ color: 'var(--gray)' }}>You haven't placed any orders with FreshKart yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {orders.map((order) => {
            const statusStyle = getStatusStyle(order.status);
            return (
              <div key={order._id} style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <span style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Order ID:</span>
                    <span style={{ fontWeight: 600, marginLeft: '5px' }}>#{order._id}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '6px 15px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem', 
                    fontWeight: 600,
                    color: statusStyle.color,
                    background: statusStyle.bg
                  }}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Status Progress Bar */}
                <div style={{ marginBottom: '40px', padding: '0 20px' }}>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Background Line */}
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: '#e5e7eb', zIndex: 1, transform: 'translateY(-50%)' }}></div>
                    
                    {/* Active Line */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: 0, 
                      width: order.status === 'Delivered' ? '100%' : order.status === 'Processing' ? '66%' : order.status === 'Packing' ? '33%' : '0%', 
                      height: '2px', 
                      background: 'var(--primary)', 
                      zIndex: 2, 
                      transform: 'translateY(-50%)',
                      transition: 'width 0.5s ease-in-out'
                    }}></div>

                    {['Pending', 'Packing', 'Processing', 'Delivered'].map((s, idx) => {
                      const isCompleted = ['Pending', 'Packing', 'Processing', 'Delivered'].indexOf(order.status) >= idx;
                      return (
                        <div key={s} style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            background: isCompleted ? 'var(--primary)' : 'white', 
                            border: `2px solid ${isCompleted ? 'var(--primary)' : '#e5e7eb'}`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: isCompleted ? 'white' : '#9ca3af',
                            transition: 'all 0.3s ease'
                          }}>
                            {idx === 0 && <Clock size={16} />}
                            {idx === 1 && <Package size={16} />}
                            {idx === 2 && <Truck size={16} />}
                            {idx === 3 && <CheckCircle size={16} />}
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: isCompleted ? 600 : 400, color: isCompleted ? 'var(--dark)' : 'var(--gray)' }}>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                  <div>
                    <h4 style={{ marginBottom: '15px' }}>Order Items</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 500 }}>{item.name}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{item.qty} kg x ${item.price.toFixed(2)}</p>
                          </div>
                          <p style={{ fontWeight: 600 }}>${(item.qty * item.price).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ marginBottom: '15px' }}>Shipping Details</h4>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '10px' }}>
                      <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '10px' }}>
                      <strong>Payment Method:</strong> {order.paymentMethod}
                    </p>
                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem' }}>
                        <span>Total Paid</span>
                        <span>${order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
