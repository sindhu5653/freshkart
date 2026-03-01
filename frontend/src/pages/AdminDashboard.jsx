import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Plus, Edit, Trash2, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Leafy',
    stock: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders')
      ]);
      setProducts(prodRes.data.products);
      setOrders(orderRes.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
      description: product.description
    });
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please upload an image');
      return;
    }
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', image: '', category: 'Leafy', stock: '', description: '' });
      toast.success(`Product ${editingProduct ? 'updated' : 'added'} successfully`);
      fetchData();
    } catch (error) {
      toast.error('Error saving product');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>Admin Dashboard</h1>
        <button 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--primary)', color: 'white' }}
          onClick={() => { setShowModal(true); setEditingProduct(null); }}
        >
          <Plus size={20} /> Add New Product
        </button>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* Products Management Table */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Product Management</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>{products.length} Products listed</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--gray-light)' }}>
                <th style={{ padding: '15px 10px' }}>Product</th>
                <th style={{ padding: '15px 10px' }}>Category</th>
                <th style={{ padding: '15px 10px' }}>Price</th>
                <th style={{ padding: '15px 10px' }}>Stock</th>
                <th style={{ padding: '15px 10px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={product.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                      <span style={{ fontWeight: 500 }}>{product.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '15px 10px' }}><span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>{product.category}</span></td>
                  <td style={{ padding: '15px 10px' }}>${product.price ? product.price.toFixed(2) : '0.00'}</td>
                  <td style={{ padding: '15px 10px' }}>{product.stock} kg</td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleEdit(product)} style={{ background: 'none', color: '#3b82f6' }}><Edit size={18} /></button>
                      <button onClick={() => handleDelete(product._id)} style={{ background: 'none', color: '#ef4444' }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '30px' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Price ($/kg)</label>
                  <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Stock (kg)</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ 
                      padding: '10px', 
                      border: '1px dashed var(--gray-light)', 
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  {formData.image && (
                    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        style={{ 
                          position: 'absolute', 
                          top: '-8px', 
                          right: '-8px', 
                          background: '#ef4444', 
                          color: 'white', 
                          borderRadius: '50%', 
                          width: '20px', 
                          height: '20px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '12px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-light)' }} 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Leafy">Leafy</option>
                  <option value="Roots">Roots</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-light)', height: '100px', fontFamily: 'inherit' }}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--gray-light)' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, background: 'var(--primary)', color: 'white' }}>{editingProduct ? 'Update Product' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
