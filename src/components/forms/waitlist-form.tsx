"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Mail, User, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

const waitlistSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required for SMS notifications")
    .refine(
      (val) => {
        if (!val) return false;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(val.replace(/[\s\-\(\)]/g, ""));
      },
      { message: "Please enter a valid phone number" }
    ),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const WaitlistForm = ({ onSuccess, className = "" }: WaitlistFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error("Database connection not available");
      }

      const { error } = await supabase
        .from('waitlist_emails')
        .insert([
          {
            email: data.email.toLowerCase().trim(),
            name: data.name.trim(),
            phone: data.phone.trim(),
            signup_date: new Date().toISOString(),
          },
        ]);

      if (error) {
        if (error.message.includes('duplicate')) {
          throw new Error('This email is already registered for the waitlist.');
        }
        throw new Error('Failed to join waitlist. Please try again.');
      }

      setIsSuccess(true);
      reset();
      onSuccess?.();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardContent className="pt-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">You're on the list!</h3>
              <p className="text-gray-600">
                Thank you for joining our beta waitlist. We've sent you a confirmation text message and will notify you as soon as WriteOff is ready.
              </p>
            </div>
            <Button
              onClick={() => {
                setIsSuccess(false);
                reset();
              }}
              variant="outline"
              className="mt-4"
            >
              Join Another Person
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Join the Beta Waitlist
        </CardTitle>
        <CardDescription className="text-gray-600">
          Get early access to WriteOff and maximize your tax deductions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 font-medium">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900 font-medium">
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                {...register("name")}
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            </div>
            {errors.name && (
              <p id="name-error" className="text-sm text-red-600" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-900 font-medium">
              Phone Number * (for SMS notifications)
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                {...register("phone")}
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
            </div>
            {errors.phone && (
              <p id="phone-error" className="text-sm text-red-600" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining Waitlist...
              </>
            ) : (
              "Join Beta Waitlist"
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By joining, you agree to receive SMS notifications about WriteOff's beta launch.
            We respect your privacy and won't spam you.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};