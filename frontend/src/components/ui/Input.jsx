import { useState } from 'react';
import Icon from '../Icon';

let inputCounter = 0;

export const Input = ({
  label,
  error,
  helper,
  required = false,
  id: idProp,
  icon,
  endAdornment: End,
  type = 'text',
  className = '',
  ...props
}) => {
  const [id] = useState(() => idProp || `fs-input-${++inputCounter}`);
  const hasFeedback = Boolean(error || helper);
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
          {required ? <span className="required" aria-hidden="true">*</span> : null}
        </label>
      )}
      <span className={`input-wrap ${icon ? '' : ''} ${End ? 'has-clear' : ''}`}>
        {icon && (
          <span className="input-icon-left">
            <Icon name={icon} size={17} />
          </span>
        )}
        <input
          id={id}
          type={type}
          required={required}
          className={`form-control ${error ? 'is-invalid' : props['aria-invalid'] ? 'is-invalid' : ''} ${className}`.trim()}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={hasFeedback ? `${id}-feedback` : undefined}
          {...props}
        />
        {End ? <span className="input-clear">{End}</span> : null}
      </span>
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

export default Input;