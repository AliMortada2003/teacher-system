import {
  Atom,
  BookOpen,
  BookOpenText,
  Calculator,
  Code2,
  FlaskConical,
  Globe,
  Languages,
  Leaf,
  Mountain
} from 'lucide-react'

const ICONS = {
  Atom,
  BookOpen,
  BookOpenText,
  Calculator,
  Code2,
  FlaskConical,
  Globe,
  Languages,
  Leaf,
  Mountain
}

export const SubjectIcon = ({ subject, size = 20, className = '' }) => {
  if (!subject) return null
  const Icon = ICONS[subject.icon] || BookOpen
  const backgroundColor = subject.colorHex || subject.color || '#2563EB'

  return (
    <div
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 text-white shadow-none ${className}`}
      style={{ backgroundColor }}
      aria-hidden="true"
    >
      <Icon size={size} strokeWidth={2.1} />
    </div>
  )
}
