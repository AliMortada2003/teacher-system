import { Loader2 } from 'lucide-react'

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon = null,
  children = null,
  className = '',
  shine = false,
  ...props
}) => {
  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
    danger: 'btn-danger'
  }
  const sizes = {
    sm: 'min-h-8 px-3 py-1.5 text-xs rounded-lg',
    md: 'min-h-10',
    lg: 'min-h-11 px-4 text-sm'
  }

  return (
    <button
      className={`${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${shine ? 'shine' : ''} ${className}`}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : Icon ? <Icon size={16} /> : null}
      {children && <span>{children}</span>}
    </button>
  )
}
