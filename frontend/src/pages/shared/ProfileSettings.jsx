import { useState } from 'react';
import { authApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/helpers';

export const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [address, setAddress] = useState(user?.address || {});
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authApi.updateProfile({ ...profile, address });
      updateUser(res.data);
      showToast('Profile updated');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (password.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (password.newPassword !== password.confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await authApi.updatePassword({ currentPassword: password.currentPassword, newPassword: password.newPassword });
      showToast(res.message || 'Password updated');
      setPassword({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="container page-section" style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: '1.6rem', marginBottom: 8 }}>My Profile</h1>
      <p className="text-muted mb-4">Manage your account details</p>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card card-padded">
          <h3 className="mb-2">Account information</h3>
          <form onSubmit={saveProfile}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-control" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" value={user?.email} disabled />
              <p className="text-small text-muted mt-1">Email cannot be changed.</p>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-control" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Street</label>
              <input className="form-control" value={address.street || ''} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-control" value={address.city || ''} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-control" value={address.state || ''} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ZIP</label>
                <input className="form-control" value={address.zip || ''} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input className="form-control" value={address.country || ''} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="card card-padded">
          <h3 className="mb-2">Change password</h3>
          <form onSubmit={savePassword}>
            <div className="form-group">
              <label className="form-label">Current password</label>
              <input className="form-control" type="password" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">New password</label>
              <input className="form-control" type="password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm new password</label>
              <input className="form-control" type="password" value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })} required />
            </div>
            <button className="btn btn-secondary" type="submit" disabled={savingPassword}>
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;