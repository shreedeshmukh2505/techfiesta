// src/components/ui/alert.jsx
export function Alert({ variant = 'info', className, children, ...props }) {
    const variantClasses = {
      info: 'bg-blue-50 text-blue-800 border-blue-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      destructive: 'bg-red-50 text-red-800 border-red-200',
      success: 'bg-green-50 text-green-800 border-green-200',
    };
  
    return (
      <div
        className={`p-4 rounded-lg border ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }