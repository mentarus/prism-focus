// Debug logging utility - controlled by DEBUG_LOGGING environment variable
// When DEBUG_LOGGING is not set or false, verbose debug() calls are tree-shaken at build time
// BUT: debugError() always logs - errors should NEVER be silent in production
const DEBUG_ENABLED = process.env.DEBUG_LOGGING === 'true'

export function debug(label: string, data?: any) {
  if (DEBUG_ENABLED) {
    console.log(label, data)
  }
}

/**
 * Safely serialize error objects, including Supabase errors which have non-enumerable properties
 */
function serializeError(error: any): any {
  if (!error) return error

  // Supabase errors have code, message, details as properties
  if (error.code || error.message) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    }
  }

  // Standard Error objects
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  return error
}

export function debugError(label: string, error?: any) {
  // Always log errors regardless of DEBUG_LOGGING - operational visibility is critical
  const serialized = serializeError(error)
  console.error(label, serialized)
  return serialized
}

/**
 * Format error for user-facing display with actual details
 */
export function formatErrorForUser(error: any): string {
  if (!error) return 'An unknown error occurred'

  // Supabase specific errors with details
  if (error.code === '23503') {
    // Foreign key violation
    if (error.details?.includes('company_founders') && error.details?.includes('profiles')) {
      return `Company linking failed: Your profile does not exist in the system. Details: ${error.details}`
    }
    return `Foreign key error: ${error.message}. Details: ${error.details || 'Unknown'}`
  }

  if (error.code === '23505') {
    // Unique constraint violation
    if (error.details?.includes('slug')) {
      return `Company slug already exists. ${error.details}`
    }
    return `Duplicate entry: ${error.message}. Details: ${error.details || 'Unknown'}`
  }

  if (error.code) {
    // Generic Postgres error
    return `Database error ${error.code}: ${error.message}${error.details ? ` - ${error.details}` : ''}`
  }

  // Standard errors
  if (error.message) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
}
