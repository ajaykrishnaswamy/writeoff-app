import twilio from 'twilio';

// Environment variables validation
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Create Twilio client only if credentials are available
let client: twilio.Twilio | null = null;

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
  try {
    client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    console.log('✅ Twilio client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Twilio client:', error);
  }
} else {
  console.warn('⚠️  Twilio credentials not configured. SMS notifications will be disabled.');
}

// Types
interface SendWelcomeMessageParams {
  name: string;
  phoneNumber: string;
}

interface SendWelcomeMessageResponse {
  success: boolean;
  message: string;
  messageSid?: string;
  error?: string;
}

// Main function to send welcome message
export const sendWelcomeMessage = async ({
  name,
  phoneNumber
}: SendWelcomeMessageParams): Promise<SendWelcomeMessageResponse> => {
  try {
    // Check if Twilio is configured
    if (!client) {
      console.log('⚠️  SMS service not configured, simulating SMS send...');
      console.log(`📱 Would send SMS to ${phoneNumber}: Hi ${name}! 🎉 You've been successfully added to the WriteOff waitlist.`);
      
      return {
        success: true,
        message: 'SMS simulation successful (Twilio not configured)',
        messageSid: 'simulated-message-id'
      };
    }

    // Validate input parameters
    if (!name || !phoneNumber) {
      const error = 'Name and phone number are required';
      console.error('❌', error);
      return {
        success: false,
        message: 'Invalid input parameters',
        error
      };
    }

    // Format the welcome message
    const messageBody = `Hi ${name}! 🎉 You've been successfully added to the WriteOff waitlist. We'll notify you as soon as our beta is ready. Thanks for your interest!`;

    // Send SMS using Twilio
    console.log('🔄 Sending SMS via Twilio...');
    const message = await client.messages.create({
      body: messageBody,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log(`✅ Welcome SMS sent successfully to ${phoneNumber}. Message SID: ${message.sid}`);

    return {
      success: true,
      message: 'Welcome SMS sent successfully',
      messageSid: message.sid
    };

  } catch (error) {
    console.error('❌ Error sending welcome SMS:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      success: false,
      message: 'Failed to send welcome SMS',
      error: errorMessage
    };
  }
};