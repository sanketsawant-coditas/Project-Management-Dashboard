import React from 'react';
import styles from './Badge.module.scss';

interface BadgeProps { variant?: 'default' | 'success' | 'warning' | 'danger'; children: React.ReactNode; }
export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => (
  <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
);