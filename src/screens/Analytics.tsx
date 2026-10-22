import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { useState } from 'react';
import { suppliers } from '../data/suppliers';
import { useNavigation } from '../NavigationContext';
import { Button, Card, CardBody, CardHeader, CellStack, ColumnChart, EmptyState, Grid, HeadRow, KpiCard, KpiGrid, Page, PageContent, Select, Table, TableContainer, Td, Toolbar, Tr, cx, toneText, type Tone } from '../components/ui';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const perfTrend = [71, 73, 72, 74, 73, 75, 76, 75, 78];
const riskTrend = [28, 30, 31, 33, 35, 34, 36, 37, 38];
const carTrend = [8, 12, 9, 14, 11, 13, 10, 15, 12];

const categories = [
  { cat: 'Raw Materials', spend: 48.2, suppliers: 312 },
  { cat: 'Electronics', spend: 31.7, suppliers: 184 },
  { cat: 'Packaging', spend: 18.4, suppliers: 241 },
  { cat: 'Mechanical', spend: 28.9, suppliers: 198 },
  { cat: 'Logistics', spend: 14.1, suppliers: 156 },
  { cat: 'IT Services', spend: 9.8, suppliers: 88 },
];

function TrendCard({ title, subtitle, value, valueTone, delta, deltaTone, values, chartTone, label }: { title: string; subtitle: string; value: string; valueTone: Tone; delta: string; deltaTone: Tone; values: number[]; chartTone: Tone; label: string }) {
  return (
    <Card>
      <CardBody>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-ink">{title}</h2>
            <div className="text-caption text-ink-muted">{subtitle}</div>
          </div>
          <div className="text-right">
            <div className={cx('text-lg font-semibold tabular-nums', toneText[valueTone])}>{value}</div>
            <div className={cx('text-caption', toneText[deltaTone])}>{delta}</div>
          </div>
        </div>
        <ColumnChart values={values} labels={months} tone={chartTone} normalize height={64} ariaLabel={label} />
      </CardBody>
    </Card>
  );
}

export default function Analytics() {
  const { openSupplier } = useNavigation();
  const [dateRange, setDateRange] = useState('All periods');
  const [category, setCategory] = useState('All Categories');
  const [region, setRegion] = useState('All Regions');
  const [riskLevel, setRiskLevel] = useState('All Risk Levels');
  const [segment, setSegment] = useState('All Segments');
  const [reportType, setReportType] = useState('Supplier Master');
  const year = Number(dateRange);
  const filteredSuppliers = suppliers.filter(supplier => {
    const updatedYear = supplier.lastUpdated ? new Date(`${supplier.lastUpdated}T00:00:00`).getFullYear() : null;
    const matchesCommon = (dateRange === 'All periods' || updatedYear === year) &&
      (category === 'All Categories' || supplier.category === category) &&
      (region === 'All Regions' || supplier.region === region) &&
      (riskLevel === 'All Risk Levels' || supplier.risk === riskLevel) &&
      (segment === 'All Segments' || supplier.segment === segment);
    if (!matchesCommon) return false;
    if (reportType === 'Qualification') return supplier.qualificationStatus !== undefined;
    if (reportType === 'Risk') return supplier.risk === 'Critical' || supplier.risk === 'High Risk';
    if (reportType === 'Performance') return supplier.perf > 0;
    if (reportType === 'Compliance') return supplier.complianceScore !== undefined;
    return true;
  });
  const totalSpend = filteredSuppliers.reduce((total, supplier) => total + (supplier.annualSpendUsdM || 0), 0);
  const scoredSuppliers = filteredSuppliers.filter(supplier => supplier.perf > 0);
  const avgPerformance = scoredSuppliers.length ? Math.round(scoredSuppliers.reduce((total, supplier) => total + supplier.perf, 0) / scoredSuppliers.length) : 0;
  const highRiskSuppliers = filteredSuppliers.filter(supplier => supplier.risk === 'Critical' || supplier.risk === 'High Risk').length;
  const avgCompliance = filteredSuppliers.length ? Math.round(filteredSuppliers.reduce((total, supplier) => total + (supplier.complianceScore || 0), 0) / filteredSuppliers.length) : 0;

  const exportCsv = () => {
    const rows = [
      ['Supplier ID', 'Supplier', 'Category', 'Material Group', 'Products', 'Region', 'Business Unit', 'Status', 'Qualification', 'Risk', 'Performance', 'Compliance', 'Annual Spend (USD M)'],
      ...filteredSuppliers.map(supplier => [supplier.id, supplier.name, supplier.category, supplier.materialGroup || '', (supplier.productTypes || []).join('; '), supplier.region || '', supplier.businessUnit || '', supplier.status, supplier.qualificationStatus || '', supplier.risk, String(supplier.perf), String(supplier.complianceScore || ''), String(supplier.annualSpendUsdM || '')]),
    ];
    const csv = rows.map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `slm-${reportType.toLowerCase()}-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Page>
      <Header breadcrumb={['Platform']} title="Reports & Analytics" action={{ label: 'Export CSV', onClick: exportCsv }} />
      <PageContent>

        {/* Filters */}
        <Card className="p-3">
          <Toolbar className="gap-3">
            <Select aria-label="Report period" value={dateRange} onChange={event => setDateRange(event.target.value)}><option>All periods</option><option>2024</option><option>2025</option><option>2026</option></Select>
            <Select aria-label="Supplier category" value={category} onChange={event => setCategory(event.target.value)}><option>All Categories</option>{[...new Set(suppliers.map(supplier => supplier.category))].map(item => <option key={item}>{item}</option>)}</Select>
            <Select aria-label="Region" value={region} onChange={event => setRegion(event.target.value)}><option>All Regions</option>{[...new Set(suppliers.map(supplier => supplier.region).filter(Boolean))].map(item => <option key={item}>{item}</option>)}</Select>
            <Select aria-label="Risk level" value={riskLevel} onChange={event => setRiskLevel(event.target.value)}><option>All Risk Levels</option><option>Critical</option><option>High Risk</option><option>Medium Risk</option><option>Low Risk</option></Select>
            <Select aria-label="Supplier segment" value={segment} onChange={event => setSegment(event.target.value)}><option>All Segments</option><option>Strategic</option><option>Preferred</option><option>Development</option></Select>
            <Select aria-label="Standard report" value={reportType} onChange={event => setReportType(event.target.value)}><option>Supplier Master</option><option>Qualification</option><option>Risk</option><option>Performance</option><option>Compliance</option></Select>
            <Button size="md" className="lg:ml-auto" onClick={() => window.print()}>Print / PDF</Button>
          </Toolbar>
        </Card>

        {/* KPI Row */}
        <KpiGrid cols={4}>
          <KpiCard label="Total Supplier Spend" value={`$${totalSpend.toFixed(1)}M`} note={`${filteredSuppliers.length} suppliers in report`} tone="brand" />
          <KpiCard label="Avg Performance Score" value={`${avgPerformance}%`} note={`${scoredSuppliers.length} suppliers scored`} tone="success" />
          <KpiCard label="High Risk Suppliers" value={String(highRiskSuppliers)} note="Critical or high in scope" tone="danger" />
          <KpiCard label="Compliance Rate" value={`${avgCompliance}%`} note="Average supplier score" tone="warning" />
        </KpiGrid>

        <Grid cols={3}>
          <TrendCard title="Performance Trend" subtitle="Portfolio avg" value="78%" valueTone="brand" delta="+6pts YTD" deltaTone="success" values={perfTrend} chartTone="brand" label="Portfolio performance trend" />
          <TrendCard title="High Risk Count" subtitle="High + Critical" value="38" valueTone="danger" delta="↑10 YTD" deltaTone="danger" values={riskTrend} chartTone="danger" label="High and critical risk count trend" />
          <TrendCard title="CAR Volume" subtitle="New CARs per month" value="12" valueTone="warning" delta="Sep 2024" deltaTone="neutral" values={carTrend} chartTone="warning" label="New CARs per month" />
        </Grid>

        {/* Spend by category */}
        <Card>
          <CardHeader title="Spend by Category" actions={<span className="text-caption text-ink-muted">Total: $284.1M</span>} />
          <CardBody>
            <div className="space-y-3">
              {categories.map(c => (
                <div key={c.cat} className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <div className="w-28 shrink-0 text-caption text-ink-soft">{c.cat}</div>
                  <div className="h-5 min-w-40 flex-1 overflow-hidden rounded-full bg-sunken">
                    <div className="flex h-full items-center rounded-full bg-brand-600 pl-2" style={{ width: `${(c.spend / 48.2) * 100}%`, minWidth: '56px' }}>
                      <span className="text-micro font-semibold text-white">${c.spend}M</span>
                    </div>
                  </div>
                  <div className="w-24 text-right text-caption text-ink-muted">{c.suppliers} suppliers</div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title={`${reportType} report`} description={`${filteredSuppliers.length} matching supplier records`} actions={<Button variant="link" onClick={exportCsv}>Download CSV</Button>} />
          <TableContainer>
            <Table minWidth={900}>
              <HeadRow columns={['Supplier', 'Category / Material', 'Products', 'Region', 'Status', 'Qualification', 'Risk', 'Performance', 'Compliance', 'Spend']} />
              <tbody>
                {filteredSuppliers.map(supplier => (
                  <Tr key={supplier.id}>
                    <Td>
                      <button type="button" onClick={() => openSupplier(supplier)} className="rounded-sm text-left"><CellStack primary={supplier.name} tone="link" secondary={supplier.id} mono /></button>
                    </Td>
                    <Td>{supplier.category} · {supplier.materialGroup}</Td>
                    <Td>{supplier.productTypes?.join(', ')}</Td>
                    <Td>{supplier.region}</Td>
                    <Td><StatusBadge status={supplier.status} small /></Td>
                    <Td>{supplier.qualificationStatus && <StatusBadge status={supplier.qualificationStatus} small />}</Td>
                    <Td><StatusBadge status={supplier.risk} small /></Td>
                    <Td className="tabular-nums">{supplier.perf || '—'}</Td>
                    <Td className="tabular-nums">{supplier.complianceScore ?? '—'}</Td>
                    <Td className="whitespace-nowrap tabular-nums">${supplier.annualSpendUsdM?.toFixed(1) || '0.0'}M</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
          {filteredSuppliers.length === 0 && <EmptyState title="No supplier records match the selected filters" description="Change the period, category, region, risk or segment filters to see results." />}
        </Card>
      </PageContent>
    </Page>
  );
}
