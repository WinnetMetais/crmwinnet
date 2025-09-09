import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ 
  currentStep, 
  steps, 
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-between mb-8", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                index < currentStep
                  ? "bg-primary text-primary-foreground border-primary"
                  : index === currentStep
                  ? "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20"
                  : "bg-background text-muted-foreground border-border"
              )}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {index < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </motion.div>
            <span className="text-xs mt-2 text-center max-w-20 text-muted-foreground">
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 bg-border mx-4 relative min-w-[60px]">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: index < currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};