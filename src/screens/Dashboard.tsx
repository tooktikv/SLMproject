import { useState, type ReactNode } from 'react';
import Header from '../components/Header';
import { ArrowRightIcon } from '../components/icons';
import { suppliers } from '../data/suppliers';
import { useNavigation } from '../NavigationContext';
import { Badge, Button, Card, CardBody, CardHeader, ColumnChart, Field, Grid, Input, KpiCard, KpiGrid, Page, PageContent, ProgressBar, Select, cx, toneText, type Tone } from '../components/ui';

const actions = [
  { supplier: 'Titan Industries', action: 'Financial assessment expires in 14 days', priority: 'High', type: 'Document' },
  { supplier: 'Apex Components', action: 'Delivery performance dropped 12% — schedule review', priority: 'Medium', type: 'Performance' },
  { supplier: 'GlobalTech Mfg', action: 'ISO 9001 certificate expired — request renewal', priority: 'High', type: 'Compliance' },
  { supplier: 'PrimeParts Co.', action: 'CAR #2024-118 pending supplier response (overdue)', priority: 'Critical', type: 'CAR' },
  { supplier: 'Vertex Systems', action: 'Requalification due in 30 days', priority: 'Medium', type: 'Qualification' },
];

const activities = [
  { time: '2h ago', msg: 'Apex Components onboarding completed — awaiting approval', type: 'onboard' },
  { time: '4h ago', msg: 'Risk score updated for Titan Industries (High → Critical)', type: 'risk' },
  { time: '6h ago', msg: 'Performance review submitted: GlobalTech Mfg Q3 2024', type: 'perf' },
  { time: '1d ago', msg: 'CAR #2024-118 issued to PrimeParts Co. (Quality defect)', type: 'car' },
  { time: '1d ago', msg: '3 suppliers completed annual qualification assessment', type: 'qual' },
  { time: '2d ago', msg: 'Vertex Systems added as new strategic supplier', type: 'new' },
];

function MiniStat({ label, value, tone = 'neutral' }: { label: string; value: ReactNode; tone?: Tone }) {
  return (
    <div>
      <div className={cx('text-xl font-semibold tabular-nums', toneText[tone])}>{value}</div>
      <div className="text-caption text-ink-muted">{label}</div>
    </div>
  );
}

function ViewLink({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button variant="link" onClick={onClick} aria-label={label} className="mt-4">
      View
      <ArrowRightIcon className="h-3.5 w-3.5" />
    </Button>
  );
}

export default function Dashboard() {
  const { navigate, openSupplier } = useNavigation();
  const [productFilter, setProductFilter] = useState('All products');
  const [yearFilter, setYearFilter] = useState('All years');
  const [monthFilter, setMonthFilter] = useState('All months');
  const products = [...new Set(suppliers.flatMap(supplier => supplier.productTypes || []))].sort();
  const filteredSuppliers = suppliers.filter(supplier => {
    const updated = supplier.lastUpdated ? new Date(`${supplier.lastUpdated}T00:00:00`) : null;
    return (productFilter === 'All products' || supplier.productTypes?.includes(productFilter)) &&
      (yearFilter === 'All years' || updated?.getFullYear() === Number(yearFilter)) &&
      (monthFilter === 'All months' || updated?.getMonth() === Number(monthFilter));
  });
  const countStatus = (status: string) => filteredSuppliers.filter(supplier => supplier.status === status).length;
  const highRiskCount = filteredSuppliers.filter(supplier => supplier.risk === 'Critical' || supplier.risk === 'High Risk').length;
  const expiringDocuments = filteredSuppliers.reduce((total, supplier) => total + (supplier.expiringDocuments || 0), 0);
  const poorPerformance = filteredSuppliers.filter(supplier => supplier.perf > 0 && supplier.perf < 60).length;
  const qualificationCounts = {
    qualified: filteredSuppliers.filter(supplier => supplier.qualificationStatus === 'Qualified').length,
    pending: filteredSuppliers.filter(supplier => supplier.qualificationStatus === 'Pending').length,
    expired: filteredSuppliers.filter(supplier => supplier.qualificationStatus === 'Expired').length,
  };
  const riskDist = [
    { label: 'Critical', count: filteredSuppliers.filter(supplier => supplier.risk === 'Critical').length, color: 'bg-danger-700' },
    { label: 'High', count: filteredSuppliers.filter(supplier => supplier.risk === 'High Risk').length, color: 'bg-danger-500' },
    { label: 'Medium', count: filteredSuppliers.filter(supplier => supplier.risk === 'Medium Risk').length, color: 'bg-warning-500' },
    { label: 'Low', count: filteredSuppliers.filter(supplier => supplier.risk === 'Low Risk').length, color: 'bg-success-500' },
  ].map(item => ({ ...item, pct: filteredSuppliers.length ? Math.round(item.count / filteredSuppliers.length * 100) : 0 }));
  const healthBands = [
    { band: 'Excellent (90–100)', count: filteredSuppliers.filter(supplier => supplier.perf >= 90).length, tone: 'success' as const },
    { band: 'Good (75–89)', count: filteredSuppliers.filter(supplier => supplier.perf >= 75 && supplier.perf < 90).length, tone: 'info' as const },
    { band: 'Fair (60–74)', count: filteredSuppliers.filter(supplier => supplier.perf >= 60 && supplier.perf < 75).length, tone: 'warning' as const },
    { band: 'Poor (< 60)', count: filteredSuppliers.filter(supplier => supplier.perf > 0 && supplier.perf < 60).length, tone: 'danger' as const },
  ];
  const averagePerformance = filteredSuppliers.length ? Math.round(filteredSuppliers.reduce((total, supplier) => total + supplier.perf, 0) / filteredSuppliers.length) : 0;
  const kpis = [
    { label: 'Total Suppliers', value: filteredSuppliers.length, delta: 'In selected scope', tone: 'brand' as const, screen: 'suppliers' as const },
    { label: 'Active Suppliers', value: countStatus('Active'), delta: `${countStatus('Active')} active records`, tone: 'success' as const, screen: 'suppliers' as const },
    { label: 'Pending Onboarding', value: countStatus('Pending'), delta: 'Awaiting activation', tone: 'warning' as const, screen: 'onboarding' as const },
    { label: 'High Risk Suppliers', value: highRiskCount, delta: 'Critical or high', tone: 'danger' as const, screen: 'risk' as const },
    { label: 'Expiring Documents', value: expiringDocuments, delta: 'Renewal follow-up', tone: 'warning' as const, screen: 'compliance' as const },
    { label: 'Poor Performance', value: poorPerformance, delta: 'Score below 60%', tone: 'danger' as const, screen: 'performance' as const },
  ];
  const activeFilterCount = [productFilter !== 'All products', yearFilter !== 'All years', monthFilter !== 'All months'].filter(Boolean).length;

  const openActionSupplier = (name: string) => {
    const supplier = suppliers.find(item => item.name.startsWith(name));
    if (supplier) openSupplier(supplier);
  };

  return (
    <Page>
      <Header breadcrumb={['SLM Platform']} title="Dashboard overview" action={{ label: '+ Add Supplier', onClick: () => navigate('onboarding') }} />
      <PageContent>

        <Card>
          <CardHeader
            title="Filter"
            compact
            actions={
              <>
                {activeFilterCount > 0 && <Badge tone="brand" small>{activeFilterCount} active</Badge>}
                <Button variant="link" disabled={activeFilterCount === 0} onClick={() => { setProductFilter('All products'); setYearFilter('All years'); setMonthFilter('All months'); }}>Clear filters</Button>
              </>
            }
          />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Product">
              <Input list="dashboard-product-options" aria-label="Filter by product" value={productFilter === 'All products' ? '' : productFilter} onChange={event => setProductFilter(event.target.value || 'All products')} placeholder="Search or select product..." />
              <datalist id="dashboard-product-options">{products.map(product => <option key={product} value={product} />)}</datalist>
            </Field>
            <Field label="Year">
              <Select aria-label="Filter by year" value={yearFilter} onChange={event => setYearFilter(event.target.value)}>
                {['All years', '2024', '2025', '2026'].map(year => <option key={year}>{year}</option>)}
              </Select>
            </Field>
            <Field label="Month">
              <Select aria-label="Filter by month" value={monthFilter} onChange={event => setMonthFilter(event.target.value)}>
                <option value="All months">All months</option>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, index) => <option key={month} value={index}>{month}</option>)}
              </Select>
            </Field>
          </CardBody>
        </Card>

        <KpiGrid cols={6}>
          {kpis.map(k => (
            <KpiCard key={k.label} label={k.label} value={k.value} note={k.delta} tone={k.tone}>
              <ViewLink onClick={() => navigate(k.screen)} label={`View ${k.label}`} />
            </KpiCard>
          ))}
        </KpiGrid>

        <Grid cols={3}>
          <Card>
            <CardHeader title="Qualification overview" />
            <CardBody>
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Qualified" value={qualificationCounts.qualified} tone="success" />
                <MiniStat label="Pending" value={qualificationCounts.pending} tone="warning" />
                <MiniStat label="Expired" value={qualificationCounts.expired} tone="danger" />
              </div>
              <ViewLink onClick={() => navigate('qualification')} label="View qualification overview" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Risk overview" />
            <CardBody>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold tabular-nums text-danger-700">{highRiskCount}</span>
                <span className="text-caption font-medium text-ink-muted">high / critical suppliers</span>
              </div>
              <div className="mt-1 text-caption text-ink-muted">From {filteredSuppliers.length} suppliers in the current selection</div>
              <ViewLink onClick={() => navigate('risk')} label="View risk overview" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Compliance monitoring" />
            <CardBody>
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Expiring" value={expiringDocuments} tone="warning" />
                <MiniStat label="Expired" value={filteredSuppliers.reduce((total, supplier) => total + (supplier.expiredDocuments || 0), 0)} tone="danger" />
                <MiniStat label="Missing" value={filteredSuppliers.reduce((total, supplier) => total + (supplier.missingDocuments || 0), 0)} />
              </div>
              <ViewLink onClick={() => navigate('compliance')} label="View compliance monitoring" />
            </CardBody>
          </Card>
        </Grid>

        <Grid cols={3}>
          {/* Supplier Health */}
          <Card>
            <CardHeader title="Supplier Health Overview" actions={<span className="text-caption text-ink-muted">All suppliers</span>} />
            <CardBody>
              <div className="space-y-3">
                {healthBands.map(h => (
                  <div key={h.band}>
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-caption text-ink-soft">{h.band}</span>
                      <span className="text-caption font-semibold tabular-nums text-ink">{h.count}</span>
                    </div>
                    <ProgressBar value={(h.count / 1284) * 100} tone={h.tone} label={h.band} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-line-subtle pt-3">
                <span className="text-caption text-ink-muted">Avg Health Score</span>
                <span className="text-caption font-semibold text-success-700">{averagePerformance} / 100</span>
              </div>
            </CardBody>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader title="Risk Distribution" actions={<span className="text-caption text-ink-muted">1,041 active</span>} />
            <CardBody>
              <div className="space-y-3">
                {riskDist.map(r => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span aria-hidden="true" className={cx('h-2 w-2 shrink-0 rounded-full', r.color)} />
                    <span className="w-14 shrink-0 text-caption text-ink-soft">{r.label}</span>
                    <ProgressBar value={(r.count / 1041) * 100} fill={r.color} size="md" label={`${r.label} risk`} className="flex-1" />
                    <span className="w-8 text-right text-caption font-semibold tabular-nums text-ink">{r.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line-subtle pt-3 text-center">
                <div>
                  <div className="text-caption text-ink-muted">High + Critical</div>
                  <div className="text-base font-semibold text-danger-700">38</div>
                </div>
                <div>
                  <div className="text-caption text-ink-muted">Trending Up</div>
                  <div className="text-base font-semibold text-warning-700">+5</div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Performance Trend */}
          <Card>
            <CardHeader title="Performance Trend" actions={<span className="text-caption text-ink-muted">Last 6 months</span>} />
            <CardBody>
              <ColumnChart values={[72, 74, 71, 76, 75, 78]} labels={['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']} unit="%" ariaLabel="Performance trend" height={96} />
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line-subtle pt-3">
                {[{ l: 'Delivery', v: '82%' }, { l: 'Quality', v: '79%' }, { l: 'Cost', v: '71%' }].map(m => (
                  <div key={m.l} className="text-center">
                    <div className="text-body font-semibold text-ink">{m.v}</div>
                    <div className="text-caption text-ink-muted">{m.l}</div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Grid>

        <Grid cols={2}>
          {/* Next Best Actions */}
          <Card>
            <CardHeader title="Next Best Actions" actions={<Badge tone="danger" small>{actions.length} open</Badge>} />
            <CardBody className="space-y-2">
              {actions.map((a, i) => (
                <button key={i} type="button" onClick={() => openActionSupplier(a.supplier)} className="flex w-full items-start gap-3 rounded-control border border-line p-3 text-left transition-colors hover:border-brand-200 hover:bg-brand-50/40">
                  <div className="min-w-0 flex-1">
                    <div className="text-body font-medium text-ink">{a.supplier}</div>
                    <div className="mt-0.5 text-caption text-ink-muted">{a.action}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge tone={a.priority === 'Medium' ? 'warning' : 'danger'} small>{a.priority}</Badge>
                    <span className="text-micro text-ink-muted">{a.type}</span>
                  </div>
                </button>
              ))}
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader title="Recent Activity" actions={<Button variant="link" onClick={() => navigate('relationship')}>View all</Button>} />
            <CardBody>
              <ol className="space-y-4">
                {activities.map((a, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-400" />
                    <div className="flex-1">
                      <div className="text-body text-ink-soft">{a.msg}</div>
                      <div className="mt-0.5 text-caption text-ink-muted">{a.time}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        </Grid>

      </PageContent>
    </Page>
  );
}
