"use client";

import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2, User, Phone, Mail } from "lucide-react";

interface FormData {
  name: string;
  phone: string;
  email: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

interface WaitlistFormProps {
  onSuccess?: () => void;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Email validation (optional, but validated if provided)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      console.log('🚀 Submitting form data:', formData);
      
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📡 Response status:', response.status);
      console.log('📄 Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is actually JSON before parsing
      const contentType = response.headers.get('content-type');
      console.log('📋 Content-Type:', contentType);

      let data = null;
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
          console.log('✅ Success response data:', data);
        } catch (parseError) {
          console.error('❌ Failed to parse JSON response:', parseError);
          throw new Error('Server returned invalid JSON. Please try again.');
        }
      } else {
        // If not JSON, get the text to see what was returned
        const textResponse = await response.text();
        console.error('❌ Non-JSON response received:', textResponse);
        
        if (response.status === 404) {
          throw new Error('API endpoint not found. Please contact support.');
        } else if (response.status >= 500) {
          throw new Error('Server error occurred. Please try again later.');
        } else {
          throw new Error('Unexpected response from server. Please try again.');
        }
      }

      if (!response.ok) {
        throw new Error(data?.error || `Server error: ${response.status}`);
      }

      // Reset form
      setFormData({ name: '', phone: '', email: '' });
      setErrors({});
      setSubmitSuccess('🎉 Successfully joined the waitlist! You should receive confirmation shortly.');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      
      if (error instanceof Error) {
        // Handle specific known errors with user-friendly messages
        if (error.message.includes('already on the waitlist') || error.message.includes('already exists')) {
          setSubmitError('This phone number is already on our waitlist. Check your email/phone for updates!');
        } else if (error.message.includes('Database temporarily unavailable')) {
          setSubmitError('Our servers are experiencing high load. Please try again in a few seconds.');
        } else if (error.message.includes('API endpoint not found')) {
          setSubmitError('Service temporarily unavailable. Please try again later or contact support.');
        } else if (error.message.includes('Server error occurred')) {
          setSubmitError('Our servers are experiencing issues. Please try again in a moment.');
        } else if (error.message.includes('invalid JSON') || error.message.includes('Unexpected response')) {
          setSubmitError('Server communication error. Please refresh the page and try again.');
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          setSubmitError('Network connection error. Please check your internet connection and try again.');
        } else {
          setSubmitError(error.message || 'Something went wrong. Please try again.');
        }
      } else {
        setSubmitError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Join the Beta Waitlist
        </h2>
        <p className="text-gray-600">
          Be the first to experience our automated tax deduction tracking
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.name 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.name && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </div>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.phone 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.phone && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.phone}
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address <span className="text-gray-500 text-sm font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </div>
          )}
        </div>

        {/* Submit Success */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              {submitSuccess}
            </div>
          </div>
        )}

        {/* Submit Error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {submitError}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Joining Waitlist...
            </>
          ) : (
            'Join Beta Waitlist'
          )}
        </button>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center">
          By joining our waitlist, you agree to receive updates about WriteOff. 
          We respect your privacy and won't share your information.
        </p>
      </form>
    </div>
  );
};