export const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

export const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))
