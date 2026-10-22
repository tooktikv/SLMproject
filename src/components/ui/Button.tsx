import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './tones';

type Variant = 'primary' | 'secondary' | 'danger' | 'danger-soft' | 'warning-soft' | 'ghost' | 'link' | 'link-muted' | 'link-danger';
type Size = 'xs' | 'sm' | 'md';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white shadow-card hover:bg-brand-700 active:bg-brand-800',
  secondary: 'border border-line bg-surface text-ink-soft shadow-card hover:bg-canvas active:bg-sunken',
  danger: 'bg-danger-600 text-white shadow-card hover:bg-danger-700',
  'danger-soft': 'bg-danger-50 text-danger-700 hover:bg-danger-200/60',
  'warning-soft': 'bg-warning-50 text-warning-700 hover:bg-warning-200/60',
  ghost: 'text-ink-soft hover:bg-sunken',
  link: 'text-brand-700 hover:text-brand-800',
  'link-muted': 'text-ink-muted hover:text-ink',
  'link-danger': 'text-danger-700 hover:text-danger-600',
};

const sizes: Record<Size, string> = {
  xs: 'h-7 px-2.5 text-caption',
  sm: 'h-8 px-3 text-caption',
  md: 'h-9 px-4 text-body',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ variant = 'secondary', size = 'sm', type = 'button', className, ...props }: ButtonProps) {
  const isLink = variant.startsWith('link');
  return (
    <button
      type={type}
      className={cx(
        'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        isLink ? cx('rounded-sm underline-offset-2 hover:underline', size === 'md' ? 'text-body' : 'text-caption') : cx('rounded-control', sizes[size]),
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function IconButton({ label, children, className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx('relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-sunken hover:text-ink', className)}
      {...props}
    >
      {children}
    </button>
  );
}
