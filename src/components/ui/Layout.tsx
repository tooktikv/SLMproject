import type { ReactNode } from 'react';
import { ArrowLeftIcon, CheckIcon, LockIcon } from '../icons';
import { InfoTip } from './Feedback';
import { cx, type Tone } from './tones';

export function Page({ children }: { children: ReactNode }) {
  return <div className="flex h-full min-h-0 flex-col bg-canvas">{children}</div>;
}

export function PageScroll({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('min-h-0 flex-1 overflow-y-auto', className)}>{children}</div>;
}

export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-[1600px] space-y-5 p-4 md:p-6', className)}>{children}</div>;
}

export function PageContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <PageScroll>
      <PageBody className={className}>{children}</PageBody>
    </PageScroll>
  );
}

export function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-sm text-caption font-medium text-ink-muted transition-colors hover:text-brand-700">
      <ArrowLeftIcon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}

export function Toolbar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('flex flex-wrap items-center gap-2', className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('text-micro font-semibold uppercase tracking-wide text-ink-muted', className)}>{children}</div>;
}

const avatarTones: Partial<Record<Tone, string>> = {
  brand: 'bg-brand-100 text-brand-700',
  success: 'bg-success-50 text-success-700',
  neutral: 'bg-sunken text-ink-soft',
};

const avatarSizes = {
  sm: 'h-7 w-7 text-micro',
  md: 'h-8 w-8 text-caption',
  lg: 'h-10 w-10 text-caption',
  xl: 'h-12 w-12 text-sm',
};

export function Avatar({
  initials,
  size = 'md',
  shape = 'circle',
  tone = 'brand',
  className,
}: {
  initials: string;
  size?: keyof typeof avatarSizes;
  shape?: 'circle' | 'square';
  tone?: 'brand' | 'success' | 'neutral';
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx('inline-flex shrink-0 items-center justify-center font-semibold', shape === 'circle' ? 'rounded-full' : 'rounded-control', avatarSizes[size], avatarTones[tone], className)}
    >
      {initials}
    </span>
  );
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  className,
}: {
  items: { value: T; label: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cx('no-scrollbar flex gap-1 overflow-x-auto', className)}>
      {items.map(item => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.value)}
            className={cx(
              '-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-body font-medium transition-colors',
              selected ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-muted hover:border-line hover:text-ink',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  label,
  className,
}: {
  items: { value: T; label: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cx('inline-flex rounded-control bg-sunken p-0.5', className)}>
      {items.map(item => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(item.value)}
            className={cx('h-7 whitespace-nowrap rounded-[0.4375rem] px-3 text-caption font-medium transition-colors', selected ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink')}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export type StepState = 'done' | 'active' | 'todo' | 'locked';

export function Stepper({ steps, compact, className }: { steps: { label: string; caption?: string; state: StepState; hint?: string }[]; compact?: boolean; className?: string }) {
  return (
    <div className={cx('overflow-x-auto', className)}>
      <ol className="flex min-w-max items-start">
        {steps.map((step, index) => (
          <li key={step.label} aria-current={step.state === 'active' || step.state === 'locked' ? 'step' : undefined} className={cx('flex items-start', index < steps.length - 1 && 'flex-1')}>
            <div className={cx('flex shrink-0 flex-col items-center text-center', compact ? 'w-16' : 'w-20')}>
              <span
                className={cx(
                  'flex items-center justify-center rounded-full font-semibold',
                  compact ? 'h-7 w-7 text-micro' : 'h-8 w-8 text-caption',
                  step.state === 'done' && 'bg-brand-600 text-white',
                  step.state === 'active' && 'bg-brand-50 text-brand-700 ring-2 ring-brand-500',
                  step.state === 'locked' && 'bg-warning-50 text-warning-700 ring-2 ring-warning-500',
                  step.state === 'todo' && 'border-2 border-line bg-surface text-ink-muted',
                )}
              >
                {step.state === 'done' ? <CheckIcon className="h-4 w-4" /> : step.state === 'locked' ? <LockIcon className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span className={cx('mt-2 font-medium', compact ? 'text-micro' : 'text-caption', step.state === 'active' ? 'text-brand-700' : step.state === 'locked' ? 'text-warning-700' : 'text-ink-soft')}>{step.label}</span>
              {(step.caption || step.hint) && (
                <span className="mt-0.5 inline-flex items-center gap-1 text-micro text-ink-muted">
                  {step.caption}
                  {step.hint && <InfoTip label={`About ${step.label}`}>{step.hint}</InfoTip>}
                </span>
              )}
            </div>
            {index < steps.length - 1 && <div aria-hidden="true" className={cx('h-0.5 min-w-4 flex-1 rounded-full', compact ? 'mt-3.5' : 'mt-4', step.state === 'done' && steps[index + 1].state !== 'locked' ? 'bg-brand-400' : 'bg-line')} />}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function DetailGrid({ items, columns = 2, className }: { items: { label: string; value: ReactNode; wide?: boolean }[]; columns?: 1 | 2; className?: string }) {
  return (
    <dl className={cx('grid gap-x-8 gap-y-4', columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1', className)}>
      {items.map(item => (
        <div key={item.label} className={cx(item.wide && columns === 2 && 'sm:col-span-2')}>
          <dt className="text-micro font-semibold uppercase tracking-wide text-ink-muted">{item.label}</dt>
          <dd className="mt-1 text-body text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
