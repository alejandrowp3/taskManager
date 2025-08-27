
import { ValidationError } from '../types';

interface ValidationMessageProps {
  errors?: ValidationError[];
  message?: string;
  type?: 'error' | 'success' | 'warning';
  className?: string;
}

export function ValidationMessage({ 
  errors = [], 
  message, 
  type = 'error', 
  className = '' 
}: ValidationMessageProps) {
  if (!errors.length && !message) {
    return null;
  }

  const baseClasses = 'rounded-md p-3 text-sm';
  const typeClasses = {
    error: 'bg-red-50 border border-red-200 text-red-700',
    success: 'bg-green-50 border border-green-200 text-green-700',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
  };

  const iconMap = {
    error: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-2">
          {iconMap[type]}
        </div>
        <div className="flex-1">
          {message && (
            <p className="font-medium mb-1">{message}</p>
          )}
          {errors.length > 0 && (
            <>
              {errors.length === 1 ? (
                <p>{errors[0].message}</p>
              ) : (
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>
                      <span className="font-medium capitalize">{error.field}:</span> {error.message}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Preset components for common use cases
export function ErrorMessage(props: Omit<ValidationMessageProps, 'type'>) {
  return <ValidationMessage {...props} type="error" />;
}

export function SuccessMessage(props: Omit<ValidationMessageProps, 'type'>) {
  return <ValidationMessage {...props} type="success" />;
}

export function WarningMessage(props: Omit<ValidationMessageProps, 'type'>) {
  return <ValidationMessage {...props} type="warning" />;
}
