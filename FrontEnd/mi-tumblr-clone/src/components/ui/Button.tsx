// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyle = "px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-50";
  const primaryStyle = "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500";
  const secondaryStyle = "bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-500";

  return (
    <button
      className={`${baseStyle} ${variant === 'primary' ? primaryStyle : secondaryStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
