import { PrismaClient } from '@prisma/client'

// Create a singleton instance
let prisma: PrismaClient

// Initialize the Prisma client
if (!prisma) {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Export types for use in application
export type DatabaseError = {
  code: string
  message: string
  field?: string
}

export type QueryResult<T> = {
  data: T | null
  error: DatabaseError | null
  success: boolean
}

// Helper functions for common database operations
export const withErrorHandling = async <T>(
  operation: () => Promise<T>
): Promise<QueryResult<T>> => {
  try {
    const data = await operation()
    return {
      data,
      error: null,
      success: true
    }
  } catch (error: any) {
    const dbError: DatabaseError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      field: error.meta?.target as string | undefined
    }

    return {
      data: null,
      error: dbError,
      success: false
    }
  }
}

// Export the main client instance
export default prisma