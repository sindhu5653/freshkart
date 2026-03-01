import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Phone, MapPin, Plus, Trash2, CheckCircle, Save } from 'lucide-react';

const ProfilePage = () => {
  const { userInfo, updateUserInfo } = useContext(AuthContext);
  
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [addresses, setAddresses] = useState(userInfo?.addresses || []);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // New Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    isDefault: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await api.put('/auth/profile', {
        name,
        email,
        phone,
        addresses,
        password,
      });
      updateUserInfo(data);
      setMessage('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const addAddressHandler = () => {
    const { address, city, postalCode, country } = newAddress;
    if (!address || !city || !postalCode || !country) {
      setError('Please fill all address fields (Street, City, Zip, Country)');
      return;
    }
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    setNewAddress({ address: '', city: '', postalCode: '', country: '', isDefault: false });
    setShowAddressForm(false);
    setMessage('Address added to list. Click "Save Changes" to save to your profile.');
  };

  const removeAddressHandler = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <h1>Your Profile</h1>
      <p style={{ color: 'var(--gray)', marginBottom: '40px' }}>Manage your personal information and delivery addresses</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Personal Info */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <User size={22} color="var(--primary)" /> Personal Information
          </h3>
          
          {message && <div style={{ background: '#ecfdf5', color: '#059669', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{message}</div>}
          {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ paddingLeft: '40px' }} />
                <User size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--gray)' }} />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ paddingLeft: '40px' }} />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--gray)' }} />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input type="text" placeholder="+1 234 567 890" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ paddingLeft: '40px' }} />
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--gray)' }} />
              </div>
            </div>

            <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid var(--gray-light)' }} />

            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <Save size={20} /> {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Addresses */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={22} color="var(--primary)" /> Saved Addresses
            </h3>
            <button 
              onClick={() => setShowAddressForm(!showAddressForm)}
              style={{ background: '#ecfdf5', color: 'var(--primary)', padding: '5px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Plus size={16} /> Add New
            </button>
          </div>

          {showAddressForm && (
            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--gray-light)' }}>
              <div className="form-group">
                <input type="text" placeholder="Address" value={newAddress.address} onChange={(e) => setNewAddress({...newAddress, address: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                <input type="text" placeholder="Postal Code" value={newAddress.postalCode} onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})} />
              </div>
              <input type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({...newAddress, country: e.target.value})} style={{ marginBottom: '15px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={addAddressHandler} className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}>Save Address</button>
                <button onClick={() => setShowAddressForm(false)} className="btn" style={{ flex: 1, padding: '8px', fontSize: '0.9rem', background: 'white', border: '1px solid var(--gray-light)' }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {addresses.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--gray)', padding: '20px' }}>No addresses saved yet.</p>
            ) : (
              addresses.map((addr, index) => (
                <div key={index} style={{ border: '1px solid var(--gray-light)', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{addr.address}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>{addr.city}, {addr.postalCode}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>{addr.country}</p>
                    {addr.isDefault && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, background: '#ecfdf5', padding: '2px 8px', borderRadius: '10px', display: 'inline-block', marginTop: '5px' }}>DEFAULT</span>}
                  </div>
                  <button onClick={() => removeAddressHandler(index)} style={{ background: 'none', color: '#ef4444' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
