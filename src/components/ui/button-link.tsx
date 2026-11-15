import { Link, type LinkProps } from 'react-router-dom';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants, ButtonFill } from './button';
import { cn } from '@/lib/utils';

type Props = LinkProps & VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, size, children, ...props }: Props) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), 'isolate', className)} {...props}>
      <ButtonFill variant={variant} />
      {children}
    </Link>
  );
}

type AProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof buttonVariants>;

export function ButtonA({ className, variant, size, children, ...props }: AProps) {
  return (
    <a className={cn(buttonVariants({ variant, size }), 'isolate', className)} {...props}>
      <ButtonFill variant={variant} />
      {children}
    </a>
  );
}
