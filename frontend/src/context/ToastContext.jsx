import { createContext, useContext, useState, useCallback } from 'react';
import Icon from '../components/Icon';

const ToastContext = createContext(null);

let idCounter = 0;

const TYPE_META = {
  success: { icon: 'check-circle' },
  error: { icon: 'alert-circle' },
  info: { icon: 'info' },
  warning: { icon: 'alert-triangle' },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = ++idCounter;
      setToasts([{ id, message, type: TYPE_META[type] ? type : 'success' }]);
      setTimeout(() => removeToast(id), 4500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast-${t.type}`}
            onClick={() => removeToast(t.id)}
            role="status"
            tabIndex={-1}
          >
            <span className="toast-icon">
              <Icon name={TYPE_META[t.type].icon} size={18} />
            </span>
            <span className="toast-message">{t.message}</span>
            <span className="toast-progress" aria-hidden="true" />
            <button
              type="button"
              className="toast-close"
              aria-label="Dismiss notification"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(t.id);
              }}
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
export default ToastProvider;