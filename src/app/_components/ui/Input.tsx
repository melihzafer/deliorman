'use client';

import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.scss';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    helperText,
    icon,
    type = 'text',
    required,
    className = '',
    id: providedId,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const id = providedId || autoId;

  const wrapperClasses = [
    styles.wrapper,
    error ? styles.errorState : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [styles.input, icon ? styles.hasIcon : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.iconEl}>{icon}</span>}
        <input
          ref={ref}
          id={id}
          type={type}
          className={inputClasses}
          placeholder={label || ' '}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          required={required}
          {...rest}
        />
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className={styles.errorMsg} role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-helper`} className={styles.helperText}>
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
