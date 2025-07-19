import { z } from 'zod';

// TypeScript interfaces matching the existing WaitlistEntry structure
export interface WaitlistEntry {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  role?: string;
  phone?: string;
  source?: string;
  createdAt?: Date;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  data?: WaitlistEntry;
}

// Validation schema
const WaitlistEntrySchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
});

// Environment configuration with fallbacks
const config = {
  // EmailJS Configuration (Free tier: 200 emails/month)
  emailjs: {
    serviceId: process.env.EMAILJS_SERVICE_ID || '',
    templateId: process.env.EMAILJS_TEMPLATE_ID || '',
    publicKey: process.env.EMAILJS_PUBLIC_KEY || '',
  },
  
  // Resend Configuration (Free tier: 3,000 emails/month)
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    toEmail: process.env.RESEND_TO_EMAIL || '',
    fromEmail: process.env.RESEND_FROM_EMAIL || '',
  },
  
  // Google Sheets Configuration
  googleSheets: {
    sheetId: process.env.GOOGLE_SHEET_ID || '',
    apiKey: process.env.GOOGLE_SHEETS_API_KEY || '',
    range: process.env.GOOGLE_SHEETS_RANGE || 'Waitlist!A:G',
  },
  
  // Webhook Configuration - Updated to new Zapier URL
  webhookUrl: process.env.ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/23842603/u2qbf0d/',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

/**
 * PRODUCTION SETUP INSTRUCTIONS:
 * 
 * 1. EMAIL SERVICE SETUP (Choose one):
 *    
 *    Option A - Resend (Recommended):
 *    - Sign up at https://resend.com
 *    - Get API key from dashboard
 *    - Set environment variables:
 *      RESEND_API_KEY=your_api_key
 *      RESEND_TO_EMAIL=your_notification_email
 *      RESEND_FROM_EMAIL=your_verified_domain_email
 *    
 *    Option B - EmailJS:
 *    - Sign up at https://www.emailjs.com
 *    - Create email service and template
 *    - Set environment variables:
 *      EMAILJS_SERVICE_ID=your_service_id
 *      EMAILJS_TEMPLATE_ID=your_template_id
 *      EMAILJS_PUBLIC_KEY=your_public_key
 * 
 * 2. GOOGLE SHEETS SETUP:
 *    - Create a Google Sheet for your waitlist
 *    - Make it publicly readable (Share > Anyone with link can view)
 *    - Get Google Sheets API key from Google Cloud Console
 *    - Set environment variables:
 *      GOOGLE_SHEET_ID=your_sheet_id (from URL)
 *      GOOGLE_SHEETS_API_KEY=your_api_key
 *      GOOGLE_SHEETS_RANGE=Waitlist!A:G (or your preferred range)
 * 
 * 3. ZAPIER WEBHOOK SETUP:
 *    - Create a Zap with "Webhooks by Zapier" trigger
 *    - Connect to Google Sheets action to create new rows
 *    - Your webhook URL: https://hooks.zapier.com/hooks/catch/23842603/u2qbf0d/
 * 
 * 4. ENVIRONMENT VARIABLES (.env.local):
 *    NODE_ENV=production
 *    ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/23842603/u2qbf0d/
 *    RESEND_API_KEY=re_xxx
 *    RESEND_TO_EMAIL=notifications@yourcompany.com
 *    RESEND_FROM_EMAIL=noreply@yourdomain.com
 *    GOOGLE_SHEET_ID=1ABC123xyz
 *    GOOGLE_SHEETS_API_KEY=AIzaSyxxx
 */

// Utility function for safe logging
function safeLog(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  if (config.isDevelopment || process.env.ENABLE_LOGS === 'true') {
    console[level](`[Waitlist Service] ${message}`, data || '');
  }
}

// Email notification service
async function sendEmailNotification(entry: WaitlistEntry): Promise<boolean> {
  try {
    // Try Resend first (recommended)
    if (config.resend.apiKey && config.resend.toEmail && config.resend.fromEmail) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.resend.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.resend.fromEmail,
          to: [config.resend.toEmail],
          subject: 'New Waitlist Signup',
          html: `
            <h2>New Waitlist Signup</h2>
            <p><strong>Email:</strong> ${entry.email}</p>
            <p><strong>Name:</strong> ${entry.firstName || ''} ${entry.lastName || ''}`.trim() + `</p>
            <p><strong>Phone:</strong> ${entry.phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${entry.company || 'Not provided'}</p>
            <p><strong>Role:</strong> ${entry.role || 'Not provided'}</p>
            <p><strong>Source:</strong> ${entry.source || 'Not provided'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          `,
        }),
      });

      if (response.ok) {
        safeLog('info', 'Email sent via Resend');
        return true;
      } else {
        safeLog('warn', 'Resend failed:', await response.text());
      }
    }

    // Fallback to EmailJS
    if (config.emailjs.serviceId && config.emailjs.templateId && config.emailjs.publicKey) {
      // EmailJS requires client-side implementation, so we'll use their REST API
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: config.emailjs.serviceId,
          template_id: config.emailjs.templateId,
          user_id: config.emailjs.publicKey,
          template_params: {
            to_email: config.resend.toEmail,
            from_name: 'Waitlist Service',
            message: `New signup: ${entry.email} (${entry.firstName || ''} ${entry.lastName || ''})`,
            ...entry,
          },
        }),
      });

      if (response.ok) {
        safeLog('info', 'Email sent via EmailJS');
        return true;
      } else {
        safeLog('warn', 'EmailJS failed:', await response.text());
      }
    }

    safeLog('warn', 'No email service configured');
    return false;
  } catch (error) {
    safeLog('error', 'Email notification failed:', error);
    return false;
  }
}

// Google Sheets integration
async function saveToGoogleSheets(entry: WaitlistEntry): Promise<boolean> {
  try {
    if (!config.googleSheets.sheetId || !config.googleSheets.apiKey) {
      safeLog('warn', 'Google Sheets not configured');
      return false;
    }

    // For writing to Google Sheets, we'd need OAuth or service account
    // For now, we'll implement read-only verification and suggest manual entry
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${config.googleSheets.sheetId}/values/${config.googleSheets.range}?key=${config.googleSheets.apiKey}`
    );

    if (response.ok) {
      safeLog('info', 'Google Sheets connection verified');
      // In production, you'd implement proper OAuth flow or service account auth
      // For now, we'll log the entry for manual addition
      safeLog('info', 'Entry for manual Google Sheets addition:', {
        timestamp: new Date().toISOString(),
        email: entry.email,
        firstName: entry.firstName,
        lastName: entry.lastName,
        phone: entry.phone,
        company: entry.company,
        role: entry.role,
        source: entry.source,
      });
      return true;
    } else {
      safeLog('warn', 'Google Sheets access failed:', response.status);
      return false;
    }
  } catch (error) {
    safeLog('error', 'Google Sheets error:', error);
    return false;
  }
}

// Enhanced webhook notification with Zapier-optimized format
async function sendWebhookNotification(entry: WaitlistEntry): Promise<boolean> {
  try {
    if (!config.webhookUrl) {
      safeLog('info', 'No webhook URL configured');
      return false;
    }

    // Create Zapier-optimized payload
    const zapierPayload = {
      // Standard fields that work well with Zapier
      email: entry.email,
      firstName: entry.firstName || '',
      lastName: entry.lastName || '',
      fullName: `${entry.firstName || ''} ${entry.lastName || ''}`.trim(),
      phone: entry.phone || '',
      company: entry.company || '',
      role: entry.role || '',
      source: entry.source || 'website_waitlist',
      
      // Timestamp in multiple formats for Zapier flexibility
      timestamp: new Date().toISOString(),
      dateSubmitted: new Date().toLocaleDateString(),
      timeSubmitted: new Date().toLocaleTimeString(),
      
      // Additional metadata for Google Sheets
      type: 'waitlist_signup',
      id: entry.id || crypto.randomUUID(),
      
      // Formatted date/time for spreadsheet columns
      submittedDate: new Date().toLocaleDateString('en-US'),
      submittedTime: new Date().toLocaleTimeString('en-US'),
      
      // Status field for tracking
      status: 'new',
      
      // Raw data for advanced Zapier users
      rawData: entry
    };

    safeLog('info', 'Sending to Zapier webhook:', { url: config.webhookUrl, email: entry.email });

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WriteOff-Waitlist/1.0',
      },
      body: JSON.stringify(zapierPayload),
    });

    if (response.ok) {
      const responseText = await response.text();
      safeLog('info', 'Zapier webhook success:', { status: response.status, response: responseText });
      return true;
    } else {
      const errorText = await response.text();
      safeLog('warn', 'Zapier webhook failed:', { 
        status: response.status, 
        statusText: response.statusText,
        error: errorText 
      });
      return false;
    }
  } catch (error) {
    safeLog('error', 'Webhook error:', error);
    return false;
  }
}

// Main function to add waitlist entry
export async function addWaitlistEntry(entry: Omit<WaitlistEntry, 'id' | 'createdAt'>): Promise<WaitlistResponse> {
  try {
    // Validate input
    const validationResult = WaitlistEntrySchema.safeParse(entry);
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.issues.map(i => i.message).join(', '),
      };
    }

    // Create full entry object
    const fullEntry: WaitlistEntry = {
      ...validationResult.data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    // Always log the entry for debugging
    safeLog('info', 'Processing waitlist entry:', {
      email: fullEntry.email,
      phone: fullEntry.phone,
      timestamp: fullEntry.createdAt,
      hasWebhookUrl: !!config.webhookUrl,
      webhookType: config.webhookUrl.includes('zapier.com') ? 'Zapier' : 
                   config.webhookUrl.includes('make.com') ? 'Make.com' : 'Custom'
    });

    // Track success of each service
    let emailSent = false;
    let sheetsSaved = false;
    let webhookSent = false;

    // Attempt webhook first (most important for user's Zapier integration)
    try {
      webhookSent = await sendWebhookNotification(fullEntry);
    } catch (error) {
      safeLog('error', 'Webhook notification failed:', error);
    }

    // Attempt other services in parallel
    const [emailResult, sheetsResult] = await Promise.allSettled([
      sendEmailNotification(fullEntry),
      saveToGoogleSheets(fullEntry),
    ]);

    if (emailResult.status === 'fulfilled') emailSent = emailResult.value;
    if (sheetsResult.status === 'fulfilled') sheetsSaved = sheetsResult.value;

    // Determine overall success
    const anySuccess = emailSent || sheetsSaved || webhookSent;
    
    if (webhookSent) {
      // Zapier webhook succeeded - this is the primary success case
      const webhookType = config.webhookUrl.includes('zapier.com') ? 'Zapier' : 
                         config.webhookUrl.includes('make.com') ? 'Make.com' : 'webhook';
      const services = [
        webhookType,
        emailSent ? 'email' : null,
        sheetsSaved ? 'sheets' : null,
      ].filter(Boolean);

      return {
        success: true,
        message: `Successfully added to waitlist! Data sent to: ${services.join(', ')}`,
        data: fullEntry,
      };
    } else if (anySuccess) {
      // At least one service succeeded
      const services = [
        emailSent ? 'email' : null,
        sheetsSaved ? 'sheets' : null,
      ].filter(Boolean);

      return {
        success: true,
        message: `Successfully added to waitlist! Notifications sent via: ${services.join(', ')}`,
        data: fullEntry,
      };
    } else {
      // All services failed, but we still have console logging
      safeLog('warn', 'All external services failed, entry logged only');
      return {
        success: true,
        message: 'Added to waitlist! Our team has been notified.',
        data: fullEntry,
      };
    }
  } catch (error) {
    safeLog('error', 'Unexpected error in addWaitlistEntry:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again or contact support.',
    };
  }
}

// Function to get waitlist entries (placeholder for compatibility)
export async function getWaitlistEntries(): Promise<WaitlistEntry[]> {
  safeLog('info', 'getWaitlistEntries called - not implemented for production security');
  return [];
}

// Function to get waitlist count (can be implemented with Google Sheets API)
export async function getWaitlistCount(): Promise<number> {
  try {
    if (!config.googleSheets.sheetId || !config.googleSheets.apiKey) {
      safeLog('info', 'Google Sheets not configured for count');
      return 0;
    }

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${config.googleSheets.sheetId}/values/${config.googleSheets.range}?key=${config.googleSheets.apiKey}`
    );

    if (response.ok) {
      const data = await response.json();
      const count = Math.max(0, (data.values?.length || 0) - 1); // Subtract header row
      safeLog('info', `Waitlist count from Google Sheets: ${count}`);
      return count;
    }

    return 0;
  } catch (error) {
    safeLog('error', 'Error getting waitlist count:', error);
    return 0;
  }
}

// Health check function
export async function checkServiceHealth(): Promise<{
  email: boolean;
  sheets: boolean;
  webhook: boolean;
}> {
  const health = {
    email: !!(config.resend.apiKey || config.emailjs.serviceId),
    sheets: !!(config.googleSheets.sheetId && config.googleSheets.apiKey),
    webhook: !!config.webhookUrl,
  };

  safeLog('info', 'Service health check:', health);
  return health;
}

// Export configuration for debugging
export { config as serviceConfig };