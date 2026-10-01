import { getErrorMessage } from '../utils/helpers';
import Icon from './Icon';

export const ErrorState = ({ error, onRetry = null, title = 'Something went wrong' }) => (
  <div className="error-state">
    <div className="empty-icon">
      <Icon name="alert-triangle" size={40} />
    </div>
    <h3>{title}</h3>
    <p className="text-muted" style={{ marginBottom: '16px' }}>
      {getErrorMessage(error)}
    </p>
    {onRetry && (
      <button className="btn btn-primary" onClick={onRetry}>
        <Icon name="refresh" size={16} />
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;