import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronDownIcon, SearchIcon } from '../icons';
import { cx } from './tones';

const control =
  'w-full rounded-control border border-line bg-surface px-3 text-body text-ink shadow-card transition-colors placeholder:text-ink-muted hover:border-ink-faint focus:border-brand-500 disabled:cursor-not-allowed disabled:bg-sunken disabled:text-ink-muted read-only:bg-sunken aria-[invalid=true]:border-danger-500';

export function Input({ className, invalid, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input aria-invalid={invalid || undefined} className={cx(control, 'h-9', className)} {...props} />;
}

export function SearchInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cx('relative min-w-0', className)}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
      <Input aria-label={props.placeholder} className="pl-9" {...props} />
    </div>
  );
}

export function Select({
  className,
  size = 'md',
  children,
  ...props
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & { size?: 'sm' | 'md'; children: ReactNode }) {
  return (
    <div className={cx('relative min-w-0', className)}>
      <select className={cx(control, size === 'sm' ? 'h-8' : 'h-9', 'appearance-none pr-8')} {...props}>
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
    </div>
  );
}

export function Field({ label, hint, required, children, className }: { label: ReactNode; hint?: ReactNode; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1.5 flex items-center gap-1 text-caption font-medium text-ink-soft">
        {label}
        {required && <span aria-hidden="true" className="text-danger-600">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-caption text-ink-muted">{hint}</span>}
    </label>
  );
}

export function Checkbox({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return <input type="checkbox" className={cx('h-4 w-4 rounded border-line accent-brand-600', className)} {...props} />;
}
