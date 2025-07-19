"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { WaitlistForm } from "@/components/forms/waitlist-form";

interface WaitlistModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "sm" | "md" | "lg";
}

export const WaitlistModal = ({ 
  trigger, 
  open, 
  onOpenChange,
  size = "md"
}: WaitlistModalProps) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-xl"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent 
        className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl`}
        aria-describedby="waitlist-modal-description"
      >
        <DialogHeader className="relative pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center pr-8">
            Join the WriteOff Waitlist
          </DialogTitle>
          <div 
            id="waitlist-modal-description" 
            className="text-gray-600 text-center text-sm mt-2"
          >
            Be the first to know when WriteOff launches and get exclusive early access
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 p-2 h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => onOpenChange?.(false)}
            aria-label="Close modal"
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        </DialogHeader>
        
        <div className="mt-4">
          <WaitlistForm 
            onSuccess={() => onOpenChange?.(false)}
            className="space-y-4"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};