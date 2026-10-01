import { useState } from 'react';
import Icon from '../Icon';

let selectCounter = 0;

export const Select = ({
  label,
  error,
  helper,
  required = false,
  id: idProp,
  options = [],
  placeholder = '',
  className = '',
  children,
  ...props
}) => {
  const [id] = useState(() => idProp || `fs-select-${++selectCounter}`);
  const hasFeedback = Boolean(error || helper);
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
          {required ? <span className="required" aria-hidden="true">*</span> : null}
        </label>
      )}
      <select
        id={id}
        required={required}
        className={`form-select ${error ? 'is-invalid' : ''} ${className}`.trim()}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={hasFeedback ? `${id}-feedback` : undefined}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {children || options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
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

export default Select;