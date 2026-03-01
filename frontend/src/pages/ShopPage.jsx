import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Filter, Search as SearchIcon } from 'lucide-react';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(50);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setCategory(cat);
    
    fetchProducts();
  }, [location.search, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?category=${category}&keyword=${searchTerm}`);
      // Simple frontend price filtering for demo
      const filtered = data.products.filter(p => p.price <= priceRange);
      setProducts(filtered);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const categories = ['All', 'Leafy', 'Roots', 'Fruits', 'Seasonal'];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="section-title" style={{ textAlign: 'left' }}>
        <h2>Fresh Market</h2>
        <p>Explore our wide range of farm-fresh produce.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }}>
        {/* Filters Sidebar */}
        <aside>
          <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: 'var(--shadow)', position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 600 }}>
              <Filter size={18} /> Filters
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ marginBottom: '12px' }}>Search</h4>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Find vegetable..." 
                  style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--gray-light)' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && fetchProducts()}
                />
                <SearchIcon size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--gray)' }} />
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ marginBottom: '12px' }}>Category</h4>
              {categories.map(cat => (
                <div key={cat} style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="category" 
                      checked={cat === 'All' ? category === '' : category === cat}
                      onChange={() => setCategory(cat === 'All' ? '' : cat)}
                    />
                    {cat}
                  </label>
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ marginBottom: '12px' }}>Max Price: <span style={{ color: 'var(--primary)' }}>${priceRange}</span></h4>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '20px', background: 'var(--primary)', color: 'white' }}
              onClick={fetchProducts}
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Product List */}
        <main>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>
          ) : (
            <>
              {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="product-grid">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
