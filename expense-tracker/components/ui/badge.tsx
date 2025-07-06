import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function Badge({ 
  className = '', 
  variant = 'default', 
  ...props 
}: BadgeProps) {
  const variants = {
    default: "bg-blue-600 text-white",
    secondary: "bg-gray-500 text-white",
    destructive: "bg-red-600 text-white",
    outline: "text-gray-800 border border-gray-300"
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  )
} 