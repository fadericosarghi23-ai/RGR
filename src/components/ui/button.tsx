import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap font-nav text-[0.78rem] uppercase tracking-[0.2em] transition-colors duration-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-rgr-black',
        outline: 'border border-rgr-black/80 text-rgr-black hover:text-white',
        ghost: 'text-rgr-black hover:text-primary',
        light: 'border border-white/60 text-white hover:text-rgr-black',
      },
      size: {
        default: 'h-12 px-7',
        sm: 'h-10 px-5',
        lg: 'h-14 px-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

/** Riempimento che "si disegna" dal basso all'hover per le varianti a contorno. */
function Fill({ variant }: { variant: ButtonProps['variant'] }) {
  if (variant !== 'outline' && variant !== 'light') return null;
  return (
    <span
      aria-hidden
      className={cn(
        'absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/btn:scale-y-100',
        variant === 'outline' ? 'bg-rgr-black' : 'bg-white',
      )}
    />
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, children, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), 'isolate', className)} {...props}>
    <Fill variant={variant} />
    {children}
  </button>
));
Button.displayName = 'Button';

export { Button, buttonVariants, Fill as ButtonFill };
