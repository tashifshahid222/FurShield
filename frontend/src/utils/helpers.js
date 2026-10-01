export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '—';
  return `$${Number(amount).toFixed(2)}`;
};

export const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural || `${singular}s`;
};

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateString);
};

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback;
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || fallback;
};

export const imageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL || ''}${path}`;
};

export const recordTypeInfo = {
  vaccination: { label: 'Vaccination', icon: 'syringe', color: 'badge-success' },
  allergy: { label: 'Allergy', icon: 'alert-circle', color: 'badge-warning' },
  illness: { label: 'Illness', icon: 'pulse', color: 'badge-danger' },
  diagnosis: { label: 'Diagnosis', icon: 'stethoscope', color: 'badge-info' },
  treatment: { label: 'Treatment', icon: 'medical-cross', color: 'badge-primary' },
  medication: { label: 'Medication', icon: 'pill', color: 'badge-primary' },
  observation: { label: 'Observation', icon: 'eye', color: 'badge-neutral' },
  lab_result: { label: 'Lab Result', icon: 'flask', color: 'badge-info' },
  prescription: { label: 'Prescription', icon: 'clipboard', color: 'badge-primary' },
  follow_up: { label: 'Follow-up', icon: 'calendar', color: 'badge-teal' },
  medical_document: { label: 'Medical Document', icon: 'file-text', color: 'badge-neutral' },
  certificate: { label: 'Certificate', icon: 'award', color: 'badge-success' },
  xray: { label: 'X-Ray', icon: 'bone', color: 'badge-info' },
  insurance: { label: 'Insurance', icon: 'shield-check', color: 'badge-teal' },
};

export const recordTypeFallback = { label: 'Record', icon: 'file-text', color: 'badge-neutral' };

export const speciesEmoji = {
  dog: '🐶',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  fish: '🐠',
  reptile: '🦎',
  hamster: '🐹',
  'guinea pig': '🐹',
  other: '🐾',
};

export const getYouTubeId = (url = '') => {
  const text = String(url);
  const m = text.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/);
  return m ? m[1] : null;
};

export const toEmbedUrl = (url = '') => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : String(url);
};