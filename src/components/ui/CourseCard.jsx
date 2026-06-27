import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpenText, Star } from 'lucide-react'

const boardColors = ['#0F6673', '#136B4A', '#0F6673', '#0E5D6A', '#17634A']
const formulaSets = [
  ['sin θ', 'Δy / Δx', '∞'],
  ['x² + y²', 'A = πr²', 'n ∑'],
  ['2x + 5 = 15', 'x = 5', 'f(x)'],
  ['a² + b²', '√x', 'log n']
]

const numberOrDash = (value) => (value === undefined || value === null ? '-' : value)

/** @param {any} props */
export const CourseCard = (props) => {
  const {
    course,
    to = '/subjects',
    action = null,
    purchased = false,
    lessonsCount,
    studentsCount,
    duration,
    rating = 4.9
  } = props

  const lessonTotal = lessonsCount ?? course.lessonsCount ?? 0
  const grade = purchased ? 'مشترك' : course.level || course.grade || 'مبتدئ'
  const seed = String(course.code || course.id || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const boardColor = boardColors[seed % boardColors.length]
  const formulaSet = formulaSets[seed % formulaSets.length]

  const content = (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-soft transition-colors hover:border-brand-200">
      <div className="relative h-[140px] overflow-hidden" style={{ backgroundColor: boardColor }}>
        <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-brand-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand-600" />
          {grade}
        </div>

        <svg viewBox="0 0 420 150" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g fill="none" stroke="#9AD2DF" strokeLinecap="round" strokeLinejoin="round" opacity="0.48">
            <circle cx="86" cy="70" r="40" />
            <path d="M47 72 L86 25 L126 72 Z M86 25 L86 111 M47 72 L126 72" />
            <path d="M274 106 C294 28 331 124 370 54" />
            <path d="M270 90 L385 90 M328 42 L328 122" />
          </g>
          <g fill="#D7EDF3" fontFamily="monospace" fontSize="18" opacity="0.85">
            <text x="128" y="48">{formulaSet[0]}</text>
            <text x="132" y="76">{formulaSet[1]}</text>
            <text x="182" y="106">{formulaSet[2]}</text>
          </g>
        </svg>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-right text-xl font-extrabold leading-8 text-ink-900">{course.name}</h3>
        <p className="mt-2 line-clamp-1 text-right text-sm font-bold leading-6 text-ink-500">{course.description}</p>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm font-bold text-ink-500">
          <span className="inline-flex items-center gap-1">
            <BookOpenText size={15} />
            {numberOrDash(lessonTotal)} درس
          </span>
          <span>{duration || course.durationLabel || `${Math.max(lessonTotal, 1) * 45} د`}</span>
          <span className="inline-flex items-center gap-1">
            <Star size={14} fill="#F59E0B" className="text-amber-500" />
            {rating}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-5">
          <p className="text-base font-extrabold text-brand-600">{course.currency || 'EGP'} {course.price}</p>
          {action || (
            <span className="inline-flex items-center gap-2 text-base font-extrabold text-ink-900 transition-colors group-hover:text-brand-600">
              عرض
              <ArrowLeft size={16} />
            </span>
          )}
        </div>

        {studentsCount !== undefined && (
          <p className="mt-3 text-right text-sm font-medium text-ink-400">{studentsCount} طالب مسجل</p>
        )}
      </div>
    </article>
  )

  if (action) return content
  return <Link to={to} className="block h-full">{content}</Link>
}
