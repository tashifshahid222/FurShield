import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/helpers';
import Icon from '../../components/Icon';

const roles = [
  { value: 'owner', icon: 'paw', label: 'Pet Owner' },
  { value: 'veterinarian', icon: 'stethoscope', label: 'Veterinarian' },
  { value: 'shelter', icon: 'building', label: 'Shelter' },
];

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'owner' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

<<<<<<< HEAD
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
=======
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
      });
      const dashboard = { owner: '/owner', veterinarian: '/veterinarian', shelter: '/shelter' };
      navigate(dashboard[result.user.role] || '/');
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-banner">
        <h2>Create your account</h2>
        <p>Join the FurShield community — free for pet owners.</p>
        <ul className="banner-points">
          <li><span className="check"><Icon name="check" size={14} /></span> Unlimited pet profiles</li>
          <li><span className="check"><Icon name="check" size={14} /></span> Health record timelines</li>
          <li><span className="check"><Icon name="check" size={14} /></span> Appointment booking</li>
          <li><span className="check"><Icon name="check" size={14} /></span> Marketplace & adoption access</li>
        </ul>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          <h1 className="auth-title">Sign up</h1>
          <p className="auth-subtitle">Create your FurShield account</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Registering as <span className="required">*</span></label>
              <div className="role-picker">
                {roles.map((r) => (
                  <div
                    key={r.value}
                    className={`role-option ${form.role === r.value ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, role: r.value })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setForm({ ...form, role: r.value })}
                  >
                    <div style={{ fontSize: '1.3rem' }}><Icon name={r.icon} size={26} /></div>
                    <div>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                {form.role === 'shelter' ? 'Shelter name' : 'Full name'} <span className="required">*</span>
              </label>
              <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email <span className="required">*</span></label>
              <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password <span className="required">*</span></label>
<<<<<<< HEAD
                <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} minLength={8} required />
=======
                <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required />
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
              </div>
              <div className="form-group">
                <label className="form-label">Confirm password <span className="required">*</span></label>
                <input className="form-control" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center mt-3 text-muted">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;