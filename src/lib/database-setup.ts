import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

export interface DatabaseSetupResult {
  success: boolean
  message: string
  error?: string
}

export async function setupDatabase(): Promise<DatabaseSetupResult> {
  try {
    console.log('🔄 Setting up database...')
    
    // Check if Prisma client is available
    try {
      await prisma.$connect()
      console.log('✅ Database connection successful')
      
      // Try to test the waitlist table
      try {
        await prisma.waitlistUser.findFirst()
        console.log('✅ Waitlist table accessible')
        
        await prisma.$disconnect()
        return {
          success: true,
          message: 'Database is ready'
        }
      } catch (tableError) {
        console.log('⚠️  Waitlist table not found, attempting to create...')
        
        // Try to push the database schema
        try {
          execSync('npx prisma db push', { 
            stdio: 'pipe',
            cwd: process.cwd()
          })
          console.log('✅ Database schema pushed successfully')
          
          // Test again
          await prisma.waitlistUser.findFirst()
          console.log('✅ Waitlist table now accessible')
          
          await prisma.$disconnect()
          return {
            success: true,
            message: 'Database setup completed successfully'
          }
        } catch (pushError) {
          console.error('❌ Failed to push database schema:', pushError)
          await prisma.$disconnect()
          return {
            success: false,
            message: 'Failed to create database schema',
            error: pushError instanceof Error ? pushError.message : 'Unknown error'
          }
        }
      }
    } catch (connectionError) {
      console.error('❌ Database connection failed:', connectionError)
      
      // Try to generate Prisma client and push schema
      try {
        console.log('🔄 Attempting to generate Prisma client...')
        execSync('npx prisma generate', { 
          stdio: 'pipe',
          cwd: process.cwd()
        })
        
        console.log('🔄 Attempting to push database schema...')
        execSync('npx prisma db push', { 
          stdio: 'pipe',
          cwd: process.cwd()
        })
        
        console.log('✅ Database schema created successfully')
        
        // Test connection again
        await prisma.$connect()
        await prisma.waitlistUser.findFirst()
        await prisma.$disconnect()
        
        return {
          success: true,
          message: 'Database setup completed successfully'
        }
      } catch (setupError) {
        console.error('❌ Database setup failed:', setupError)
        return {
          success: false,
          message: 'Database setup failed',
          error: setupError instanceof Error ? setupError.message : 'Unknown error'
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Database setup error:', error)
    return {
      success: false,
      message: 'Database setup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Function to ensure database is ready before operations
export async function ensureDatabaseReady(): Promise<boolean> {
  try {
    const result = await setupDatabase()
    return result.success
  } catch (error) {
    console.error('Database readiness check failed:', error)
    return false
  }
}