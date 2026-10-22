import { BellIcon, ChevronRightIcon } from './icons';
import { Avatar, Button, IconButton } from './ui';

export default function Header({
  breadcrumb,
  title,
  action,
}: {
  breadcrumb: string[];
  title: string;
  action?: { label: string; onClick?: () => void };
}) {
  return (
    <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line bg-surface py-2.5 pl-16 pr-4 md:pr-6 lg:pl-6">
      <div className="min-w-0 flex-1 basis-48">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-1 text-caption text-ink-muted">
            {breadcrumb.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-center gap-1">
                {index > 0 && <ChevronRightIcon className="h-3 w-3 text-ink-faint" />}
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="text-lg font-semibold leading-tight tracking-tight text-ink md:text-xl">{title}</h1>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <IconButton label="Notifications">
          <BellIcon className="h-4.5 w-4.5" />
          <span aria-hidden="true" className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-surface" />
        </IconButton>
        <Avatar initials="JK" className="max-sm:hidden" />
        {action && (
          <Button variant="primary" size="md" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </header>
  );
}
