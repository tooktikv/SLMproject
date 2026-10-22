import type { ReactNode } from 'react';
import { cx, type Tone } from './tones';

const badgeTones: Record<Tone, { pill: string; dot: string }> = {
  neutral: { pill: 'bg-sunken text-ink-soft ring-line', dot: 'bg-ink-faint' },
  brand: { pill: 'bg-brand-50 text-brand-700 ring-brand-200', dot: 'bg-brand-500' },
  success: { pill: 'bg-success-50 text-success-700 ring-success-200', dot: 'bg-success-500' },
  warning: { pill: 'bg-warning-50 text-warning-700 ring-warning-200', dot: 'bg-warning-500' },
  danger: { pill: 'bg-danger-50 text-danger-700 ring-danger-200', dot: 'bg-danger-500' },
  info: { pill: 'bg-info-50 text-info-700 ring-info-200', dot: 'bg-info-500' },
};

export function Badge({
  tone = 'neutral',
  dot,
  small,
  strong,
  children,
  className,
}: {
  tone?: Tone;
  dot?: boolean;
  small?: boolean;
  strong?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const styles = badgeTones[tone];
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full ring-1 ring-inset',
        strong ? 'font-semibold' : 'font-medium',
        small ? 'px-2 py-0.5 text-micro' : 'px-2.5 py-0.5 text-caption',
        styles.pill,
        className,
      )}
    >
      {dot && <span aria-hidden="true" className={cx('h-1.5 w-1.5 shrink-0 rounded-full', styles.dot)} />}
      {children}
    </span>
  );
}
