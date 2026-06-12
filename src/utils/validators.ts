export function isValidScore(value: string): boolean {
  const num = Number(value)
  return !Number.isNaN(num) && Number.isInteger(num) && num >= 0 && num <= 99
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2
}
