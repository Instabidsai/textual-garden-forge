export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null

  const debounced = function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  } as T

  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced as T & { cancel: () => void }
}