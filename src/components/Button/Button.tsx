import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', loading, ...props }) => (
  <button className={`${styles.button} ${styles[variant]}`} disabled={loading || props.disabled} {...props}>
    {loading ? 'Loading...' : children}
  </button>
);