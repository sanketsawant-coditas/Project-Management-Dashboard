import React from 'react';
import styles from './Badge.module.scss';

interface BadgeProps { 
  variant?: string; 
  children: React.ReactNode; 
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => {
  const validVariant = styles[variant as keyof typeof styles] ? variant : 'default';
  return (
    <span className={`${styles.badge} ${styles[validVariant as keyof typeof styles]}`}>
      {children}
    </span>
  );
};