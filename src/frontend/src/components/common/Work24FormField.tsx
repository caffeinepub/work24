import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Work24FormFieldProps {
  label: string;
  error?: string | null;
  helper?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export default function Work24FormField({
  label,
  error,
  helper,
  required,
  children,
  className,
}: Work24FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {helper && !error && (
        <p className="text-xs text-muted-foreground">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
