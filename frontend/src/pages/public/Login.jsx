import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/helpers';
import Icon from '../../components/Icon';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(form);
      const role = result.user.role;
      const dashboard = { owner: '/owner', veterinarian: '/veterinarian', shelter: '/shelter', admin: '/admin' };
      const from = location.state?.from?.pathname;
      navigate(from || dashboard[role] || '/');
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-banner">
        <h2>Welcome back!</h2>
        <p>Log in to manage your pets, appointments, orders and more.</p>
        <ul className="banner-points">
          <li><span className="check"><Icon name="check" size={14} /></span> Manage pet profiles & health records</li>
          <li><span className="check"><Icon name="check" size={14} /></span> Book and track veterinary appointments</li>
          <li><span className="check"><Icon name="check" size={14} /></span> Shop the marketplace & track orders</li>
          <li><span className="check"><Icon name="check" size={14} /></span> Follow shelter adoption listings</li>
        </ul>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          <h1 className="auth-title">Log in to FurShield</h1>
          <p className="auth-subtitle">Enter your details to continue</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email <span className="required">*</span></label>
              <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          <p className="text-center mt-3 text-muted">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
          <div className="demo-accounts">
            <p className="text-small text-muted" style={{ marginBottom: 8 }}>
              Demo accounts — click to fill:
            </p>
            {[
              { role: 'Admin', email: 'admin@furshield.com', password: 'admin123', icon: 'shield' },
              { role: 'Veterinarian', email: 'vet@furshield.com', password: 'vet12345', icon: 'stethoscope' },
              { role: 'Shelter', email: 'shelter@furshield.com', password: 'shelter123', icon: 'building' },
            ].map((d) => (
              <button
                key={d.role}
                type="button"
                className="demo-account"
                onClick={() => setForm({ email: d.email, password: d.password })}
              >
                <span style={{ fontSize: '0.85rem' }}><Icon name={d.icon} size={18} /></span>
                <span>
                  <strong style={{ display: 'block', fontSize: '0.8rem' }}>{d.role}</strong>
                  <span className="text-small">{d.email}</span>
                  <span className="text-small" style={{ color: 'var(--text-light)' }}> / {d.password}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;