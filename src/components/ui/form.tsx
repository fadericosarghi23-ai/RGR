import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'peer block h-12 w-full border-0 border-b border-input bg-transparent px-0 text-base text-rgr-ink transition-colors placeholder:text-transparent focus:border-primary focus:outline-none focus:ring-0',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'peer block min-h-36 w-full resize-y border-0 border-b border-input bg-transparent px-0 py-3 text-base text-rgr-ink transition-colors placeholder:text-transparent focus:border-primary focus:outline-none',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('label-tech block text-xs md:text-[0.68rem]', className)} {...props} />;
}
