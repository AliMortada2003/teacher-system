import { ChevronDown } from 'lucide-react'
import { useId } from 'react'

const FieldShell = ({ id, label, error, hint, className, children }) => {
  const describedBy = error || hint ? `${id}-message` : undefined
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={id} className="label">{label}</label>}
      {children(describedBy)}
      {(error || hint) && (
        <p id={describedBy} className={`text-xs leading-5 ${error ? 'text-red-600' : 'text-ink-500'}`}>
          {error || hint}
        </p>
      )}
    </div>
  )
}

export const Input = ({ label = '', error = '', hint = '', className = '', ...props }) => {
  const id = useId()
  return (
    <FieldShell id={props.id || id} label={label} error={error} hint={hint} className={className}>
      {(describedBy) => (
        <input
          id={props.id || id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={`input ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
          {...props}
        />
      )}
    </FieldShell>
  )
}

export const Textarea = ({ label = '', error = '', hint = '', className = '', ...props }) => {
  const id = useId()
  return (
    <FieldShell id={props.id || id} label={label} error={error} hint={hint} className={className}>
      {(describedBy) => (
        <textarea
          id={props.id || id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={`input min-h-[120px] resize-y ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
          {...props}
        />
      )}
    </FieldShell>
  )
}

export const Select = ({ label = '', options = [], error = '', hint = '', className = '', ...props }) => {
  const id = useId()
  return (
    <FieldShell id={props.id || id} label={label} error={error} hint={hint} className={className}>
      {(describedBy) => (
        <div className="relative">
          <select
            id={props.id || id}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            className={`input appearance-none pl-9 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
        </div>
      )}
    </FieldShell>
  )
}
