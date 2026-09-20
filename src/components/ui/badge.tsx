import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-mono font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]',
  {
    variants: {
      variant: {
        default:
          'border-[var(--border-accent)] bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]',
        secondary:
          'border-white/10 bg-white/5 text-neutral-300',
        destructive:
          'border-rose-500/30 bg-rose-500/10 text-rose-300',
        outline:
          'border-white/15 text-neutral-400',
        success:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
