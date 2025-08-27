import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center py-12"
      role="status"
      aria-live="polite"
    >
      <Loader2 
        className={`${sizeClasses[size]} text-blue-600 animate-spin`}
        aria-hidden="true"
      />
      {message && (
        <p className="mt-3 text-sm text-gray-600">
          {message}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}