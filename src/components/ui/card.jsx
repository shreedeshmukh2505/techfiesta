// src/components/ui/card.jsx
export function Card({ className, children, ...props }) {
    return (
      <div className={`bg-white rounded-lg shadow-md ${className}`} {...props}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ className, children, ...props }) {
    return (
      <div className={`p-6 ${className}`} {...props}>
        {children}
      </div>
    );
  }
  
  export function CardTitle({ className, children, ...props }) {
    return (
      <h3 className={`text-lg font-medium ${className}`} {...props}>
        {children}
      </h3>
    );
  }
  
  export function CardContent({ className, children, ...props }) {
    return (
      <div className={`p-6 pt-0 ${className}`} {...props}>
        {children}
      </div>
    );
  }