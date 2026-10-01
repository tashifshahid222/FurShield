import { useState } from 'react';
import Icon from '../Icon';

let textareaCounter = 0;

export const Textarea = ({
  label,
  error,
  helper,
  required = false,
  id: idProp,
  rows = 4,
  className = '',
  ...props
}) => {
  const [id] = useState(() => idProp || `fs-textarea-${++textareaCounter}`);
  const hasFeedback = Boolean(error || helper);
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
          {required ? <span className="required" aria-hidden="true">*</span> : null}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        required={required}
        className={`form-control ${error ? 'is-invalid' : ''} ${className}`.trim()}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={hasFeedback ? `${id}-feedback` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-feedback`} className="form-error">
          <Icon name="alert-circle" size={14} />
          <span>{error}</span>
        </p>
      )}
      {!error && helper && (
        <p id={`${id}-feedback`} className="helper-text">
          {helper}
        </p>
      )}
    </div>
  );
};

export default Textarea;