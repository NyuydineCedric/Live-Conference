// Validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateMeetingTitle = (title) => {
  return title.trim().length > 0 && title.length <= 100
}

// Format helpers
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

// ID generation
export const generateMeetingId = () => {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
}

export const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substring(2, 9)
}

// Clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

// String utilities
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const truncateString = (str, length = 50) => {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Array utilities
export const groupBy = (arr, key) => {
  return arr.reduce((result, obj) => {
    const group = obj[key]
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(obj)
    return result
  }, {})
}

export const uniqueBy = (arr, key) => {
  return Array.from(new Map(arr.map((item) => [item[key], item])).values())
}

// Size utilities
export const bytesToSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Local storage
export const setLocalStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error setting localStorage:', error)
  }
}

export const getLocalStorage = (key) => {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Error getting localStorage:', error)
    return null
  }
}

export const removeLocalStorage = (key) => {
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing localStorage:', error)
  }
}

// Delay utility
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Object utilities
export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

export const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const mergeObjects = (target, source) => {
  return { ...target, ...source }
}
