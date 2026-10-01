export const ownerLinks = [
  { to: '/owner', label: 'Dashboard', icon: 'dashboard', end: true, section: 'Overview' },
  { to: '/owner/pets', label: 'My Pets', icon: 'paw', section: 'Pets & Care' },
  { to: '/owner/appointments', label: 'Appointments', icon: 'calendar', section: 'Pets & Care' },
  { to: '/owner/orders', label: 'My Orders', icon: 'box', section: 'Pets & Care' },
  { to: '/cart', label: 'Cart', icon: 'cart', section: 'Account' },
  { to: '/notifications', label: 'Notifications', icon: 'bell', section: 'Account' },
  { to: '/profile', label: 'Profile', icon: 'user', section: 'Account' },
];

export const vetLinks = [
  { to: '/veterinarian', label: 'Dashboard', icon: 'dashboard', end: true, section: 'Overview' },
  { to: '/veterinarian/appointments', label: 'Appointments', icon: 'calendar', section: 'Practice' },
  { to: '/veterinarian/patients', label: 'Patients & Pets', icon: 'paw', section: 'Practice' },
  { to: '/veterinarian/profile', label: 'My Practice', icon: 'stethoscope', section: 'Practice' },
  { to: '/notifications', label: 'Notifications', icon: 'bell', section: 'Account' },
  { to: '/profile', label: 'Profile', icon: 'user', section: 'Account' },
];

export const shelterLinks = [
  { to: '/shelter', label: 'Dashboard', icon: 'dashboard', end: true, section: 'Overview' },
  { to: '/shelter/listings', label: 'Adoption Listings', icon: 'heart', section: 'Listings' },
  { to: '/shelter/profile', label: 'Shelter Profile', icon: 'building', section: 'Listings' },
  { to: '/notifications', label: 'Notifications', icon: 'bell', section: 'Account' },
  { to: '/profile', label: 'Profile', icon: 'user', section: 'Account' },
];

export const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true, section: 'Overview' },
  { to: '/admin/users', label: 'Users', icon: 'users', section: 'Management' },
  { to: '/admin/pets', label: 'Pets', icon: 'paw', section: 'Management' },
  { to: '/admin/appointments', label: 'Appointments', icon: 'calendar', section: 'Management' },
  { to: '/admin/adoptions', label: 'Adoptions', icon: 'heart', section: 'Management' },
  { to: '/admin/reviews', label: 'Reviews', icon: 'star', section: 'Management' },
  { to: '/admin/products', label: 'Products', icon: 'bag', section: 'Store' },
  { to: '/admin/categories', label: 'Categories', icon: 'tag', section: 'Store' },
  { to: '/admin/orders', label: 'Orders', icon: 'box', section: 'Store' },
  { to: '/cart', label: 'Cart', icon: 'cart', section: 'Store' },
  { to: '/admin/articles', label: 'Articles', icon: 'file-text', section: 'Content' },
  { to: '/admin/faqs', label: 'FAQs', icon: 'question-circle', section: 'Content' },
  { to: '/admin/videos', label: 'Videos', icon: 'video', section: 'Content' },
  { to: '/admin/messages', label: 'Messages', icon: 'message', section: 'Support' },
  { to: '/admin/notifications', label: 'Notifications', icon: 'bell', section: 'Support' },
];

export const linksByRole = {
  owner: ownerLinks,
  veterinarian: vetLinks,
  shelter: shelterLinks,
  admin: adminLinks,
};

export default linksByRole;