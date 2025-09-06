import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, isLoading, disabled, className, ...props }) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center px-4 py-2 font-semibold text-white 
        bg-brand-secondary rounded-md shadow-sm transition-colors duration-200
        hover:bg-brand-primary 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 dark:focus:ring-offset-dark-200 focus:ring-brand-secondary
        disabled:bg-base-300 dark:disabled:bg-dark-300 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  );
};

export default Button;
