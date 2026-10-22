import { useEffect, useState, type ComponentType } from 'react';
import { Screen } from '../types';
import {
  BadgeCheckIcon,
  BarChartIcon,
  BuildingIcon,
  ClipboardCheckIcon,
  CloseIcon,
  DashboardIcon,
  FileSearchIcon,
  PanelLeftIcon,
  SettingsIcon,
  ShieldAlertIcon,
  TrendingUpIcon,
  UserPlusIcon,
  UsersIcon,
  WrenchIcon,
  type IconProps,
} from './icons';
import { Avatar, cx } from './ui';

type NavItem = { id: Screen; label: string; Icon: ComponentType<IconProps> };
type NavGroup = { label?: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  { label: 'Overview', items: [
    { id: 'dashboard', label: 'Dashboard overview', Icon: DashboardIcon },
  ]},
  { label: 'Supplier lifecycle', items: [
    { id: 'suppliers', label: 'Supplier Management', Icon: BuildingIcon },
    { id: 'onboarding', label: 'Supplier onboarding', Icon: UserPlusIcon },
    { id: 'qualification', label: 'Supplier qualification', Icon: BadgeCheckIcon },
  ]},
  { label: 'Performance & control', items: [
    { id: 'risk', label: 'Risk Management', Icon: ShieldAlertIcon },
    { id: 'performance', label: 'Performance', Icon: TrendingUpIcon },
    { id: 'compliance', label: 'Supplier compliance', Icon: ClipboardCheckIcon },
    { id: 'audit', label: 'Audit & Assessment', Icon: FileSearchIcon },
    { id: 'car', label: 'CAR & CAP', Icon: WrenchIcon },
  ]},
  { label: 'Supplier relationships', items: [
    { id: 'relationship', label: 'Contacts & Relationship', Icon: UsersIcon },
  ]},
  { label: 'Platform', items: [
    { id: 'analytics', label: 'Reports & Analytics', Icon: BarChartIcon },
    { id: 'administration', label: 'Administration', Icon: SettingsIcon },
  ]},
];

export default function Sidebar({ active, onNavigate, isOpen, onClose }: { active: Screen; onNavigate: (s: Screen) => void; isOpen: boolean; onClose: () => void }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && <button type="button" aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-ink/40 lg:hidden" />}
      <aside
        className={cx(
          'z-50 flex h-full shrink-0 flex-col border-r border-line bg-surface',
          'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:w-72 max-lg:shadow-popover max-lg:transition-[transform,visibility]',
          'lg:transition-[width] lg:duration-200',
          collapsed ? 'lg:w-17' : 'lg:w-60',
          isOpen ? 'max-lg:visible max-lg:translate-x-0' : 'max-lg:invisible max-lg:-translate-x-full',
        )}
      >
        <div className={cx('flex h-16 shrink-0 items-center gap-2.5 border-b border-line px-4', collapsed && 'lg:justify-center lg:px-0')}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-brand-600 text-sm font-bold text-white">S</div>
          <div className={cx('min-w-0 flex-1', collapsed && 'lg:hidden')}>
            <div className="truncate text-sm font-semibold tracking-tight text-ink">SLM Platform</div>
            <div className="text-micro font-medium uppercase tracking-widest text-ink-muted">Enterprise</div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-control text-ink-muted hover:bg-sunken hover:text-ink lg:hidden"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group, groupIndex) => (
            <div key={group.label || groupIndex} className={groupIndex ? 'mt-5' : ''}>
              {group.label && (
                <div className={cx('mb-1.5 px-3 text-micro font-semibold uppercase tracking-wider text-ink-muted', collapsed && 'lg:hidden')}>{group.label}</div>
              )}
              {group.label && groupIndex > 0 && collapsed && <div aria-hidden="true" className="mx-3 mb-2 hidden border-t border-line lg:block" />}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const isActive = active === item.id || (active === 'supplier360' && item.id === 'suppliers');
                  return (
                    <button
                      key={item.id}
                      type="button"
                      title={collapsed ? item.label : undefined}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => { onNavigate(item.id); onClose(); }}
                      className={cx(
                        'group relative flex w-full items-center gap-3 rounded-control px-3 py-2 text-left transition-colors',
                        collapsed && 'lg:justify-center lg:px-0',
                        isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-sunken hover:text-ink',
                      )}
                    >
                      {isActive && <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brand-600" />}
                      <item.Icon className={cx('h-4.5 w-4.5 shrink-0', isActive ? 'text-brand-600' : 'text-ink-muted group-hover:text-ink-soft')} />
                      <span className={cx('truncate text-body font-medium', collapsed && 'lg:sr-only')}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-line p-3">
          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(current => !current)}
            className={cx(
              'mb-2 flex w-full items-center gap-3 rounded-control px-3 py-2 text-ink-muted transition-colors hover:bg-sunken hover:text-ink max-lg:hidden',
              collapsed && 'lg:justify-center lg:px-0',
            )}
          >
            <PanelLeftIcon className="h-4.5 w-4.5 shrink-0" />
            <span className={cx('text-body font-medium', collapsed && 'lg:sr-only')}>Collapse</span>
          </button>
          <div className={cx('flex items-center gap-2.5 rounded-control px-2 py-1.5', collapsed && 'lg:justify-center lg:px-0')}>
            <Avatar initials="JK" />
            <div className={cx('min-w-0 flex-1', collapsed && 'lg:hidden')}>
              <div className="truncate text-body font-medium text-ink">James Kim</div>
              <div className="truncate text-caption text-ink-muted">Procurement Manager</div>
            </div>
            <button
              type="button"
              aria-label="Settings"
              className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-sunken hover:text-ink', collapsed && 'lg:hidden')}
            >
              <SettingsIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
