export function usePasswordValidation(password: string) {
  const errors: string[] = [];
  if (password.length < 8) errors.push('minLength');
  if (!/[A-Z]/.test(password)) errors.push('uppercase');
  if (!/[a-z]/.test(password)) errors.push('lowercase');
  if (!/[0-9]/.test(password)) errors.push('number');
  return { errors, isValid: errors.length === 0 };
}
