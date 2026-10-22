import { useState } from 'react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { Supplier, suppliers as supplierDirectory } from '../data/suppliers';
import { Badge, Button, Callout, Card, CardBody, CardHeader, CellStack, EmptyState, Eyebrow, Grid, HeadRow, KpiCard, KpiGrid, Modal, Page, PageBody, PageScroll, ProgressBar, SearchInput, Select, Table, TableContainer, Tabs, Td, Th, Toolbar, Tr, cx, type Tone } from '../components/ui';

const campaigns = [
  { name: 'Annual Qualification 2024', scope: 'All active suppliers', deadline: 'Dec 31, 2024', progress: 64, total: 1041, done: 667 },
  { name: 'ESG Qualification Wave 1', scope: 'Tier 1 suppliers', deadline: 'Nov 15, 2024', progress: 82, total: 214, done: 175 },
  { name: 'Technical Capability Assessment', scope: 'Facilities & Engineering', deadline: 'Oct 31, 2024', progress: 45, total: 88, done: 40 },
];

type QualificationRecord = {
  name: string;
  id: string;
  category: string;
  score?: number;
  status: 'Qualified' | 'Pending' | 'Expired' | 'Rejected';
  scope: { category?: string; plant?: string; businessUnit?: string };
  validFrom?: string;
  validUntil?: string;
  lastAssessment?: string;
  requal?: string;
  skills: number;
  criteria?: { name: string; result: string; score?: string }[];
  history?: { date: string; result: string; note?: string }[];
  reason?: string;
};

const qualificationRows: QualificationRecord[] = [
  { name: 'PrimeParts Co.', id: 'SUP-0067', category: 'Mechanical', score: 94, status: 'Qualified', scope: { category: 'Mechanical', plant: 'Cleveland Plant', businessUnit: 'Industrial Components' }, validFrom: 'Mar 15, 2024', validUntil: 'Mar 14, 2027', lastAssessment: 'Mar 15, 2024', requal: 'Jan 2027', skills: 6, criteria: [{ name: 'Quality management', result: 'Pass', score: '96 / 100' }, { name: 'Financial stability', result: 'Pass', score: '92 / 100' }, { name: 'Delivery capability', result: 'Pass', score: '94 / 100' }], history: [{ date: 'Mar 15, 2024', result: 'Qualified', note: 'Initial supplier assessment' }, { date: 'Mar 12, 2023', result: 'Qualified', note: 'Annual reassessment' }] },
  { name: 'Nordex Logistics', id: 'SUP-0103', category: 'Logistics', score: 88, status: 'Qualified', scope: { category: 'Logistics', plant: 'EMEA Distribution Network', businessUnit: 'Global Logistics' }, validFrom: 'Jul 30, 2024', validUntil: 'Jul 29, 2027', lastAssessment: 'Jul 30, 2024', requal: 'May 2027', skills: 4, criteria: [{ name: 'Service coverage', result: 'Pass', score: '91 / 100' }, { name: 'Safety compliance', result: 'Pass', score: '86 / 100' }, { name: 'Business continuity', result: 'Pass', score: '87 / 100' }], history: [{ date: 'Jul 30, 2024', result: 'Qualified', note: 'Regional logistics review' }] },
  { name: 'Apex Components Inc', id: 'SUP-0034', category: 'Electronics', score: 71, status: 'Pending', scope: { category: 'Electronics', plant: 'Hsinchu Plant', businessUnit: 'Control Systems' }, lastAssessment: 'Aug 28, 2024', requal: 'Dec 2024', skills: 3, criteria: [{ name: 'Quality management', result: 'Pass', score: '82 / 100' }, { name: 'Financial stability', result: 'Review required', score: '61 / 100' }, { name: 'Information security', result: 'Evidence pending' }], history: [{ date: 'Aug 28, 2024', result: 'Pending', note: 'Awaiting updated financial evidence' }], reason: 'Qualification decision is pending source verification of financial evidence.' },
  { name: 'Chemcore Solutions', id: 'SUP-0118', category: 'Chemicals', score: 52, status: 'Rejected', scope: { category: 'Specialty Chemicals', plant: 'Lagos Plant', businessUnit: 'Process Materials' }, lastAssessment: 'Sep 3, 2024', skills: 0, criteria: [{ name: 'Environmental controls', result: 'Fail', score: '48 / 100' }, { name: 'Safety compliance', result: 'Fail', score: '55 / 100' }, { name: 'Quality management', result: 'Review required', score: '63 / 100' }], history: [{ date: 'Sep 3, 2024', result: 'Rejected', note: 'Initial assessment' }], reason: 'Minimum environmental and safety thresholds were not met.' },
  { name: 'GlobalTech Manufacturing', id: 'SUP-0051', category: 'Packaging', score: 78, status: 'Expired', scope: { category: 'Packaging', plant: 'Monterrey Plant', businessUnit: 'Consumer Products' }, validFrom: 'Sep 2, 2023', validUntil: 'Sep 1, 2025', lastAssessment: 'Sep 1, 2023', requal: 'Renewal required', skills: 5, criteria: [{ name: 'Quality management', result: 'Pass', score: '84 / 100' }, { name: 'Capacity review', result: 'Pass', score: '76 / 100' }], history: [{ date: 'Sep 1, 2023', result: 'Qualified', note: 'Qualification validity has since expired' }], reason: 'The source qualification validity period has ended.' },
  { name: 'Titan Industries Ltd', id: 'SUP-0012', category: 'Raw Materials', score: 69, status: 'Pending', scope: { category: 'Raw Materials', plant: 'Dusseldorf Plant', businessUnit: 'Industrial Materials' }, lastAssessment: 'Sep 2, 2024', requal: 'Nov 2024', skills: 5, criteria: [{ name: 'Quality management', result: 'Pass', score: '81 / 100' }, { name: 'Financial stability', result: 'Review required', score: '57 / 100' }], history: [{ date: 'Sep 2, 2024', result: 'Pending', note: 'Risk review requires procurement approval' }], reason: 'Final qualification decision is pending review of the latest financial assessment.' },
];

const requalificationRequests = [
  { id: 'RQ-2024-031', supplierId: 'SUP-0012', reason: 'Financial risk rating increased after latest review', requestDate: 'Sep 2, 2024', scope: 'Raw Materials · Dusseldorf Plant', status: 'In Progress', result: 'Financial evidence review pending', validUntil: 'Jan 12, 2025', expiryDate: 'Jan 12, 2025' },
  { id: 'RQ-2024-028', supplierId: 'SUP-0051', reason: 'Qualification certificate expired', requestDate: 'Sep 1, 2024', scope: 'Packaging · Monterrey Plant', status: 'Pending', result: 'Assessment not started', validUntil: 'Sep 1, 2025', expiryDate: 'Sep 1, 2025' },
  { id: 'RQ-2024-021', supplierId: 'SUP-0034', reason: 'Annual requalification cycle', requestDate: 'Aug 28, 2024', scope: 'Electronics · Hsinchu Plant', status: 'Pending', result: 'Awaiting source assessment', validUntil: 'Not provided', expiryDate: 'Feb 28, 2025' },
];

const capabilities = [
  { supplierId: 'SUP-0012', group: 'Bathroom Renovation', skill: 'Sanitary ware installation', level: 3, rate: '800 THB / set', validTo: 'Dec 31, 2025', source: 'SkillVerify' },
  { supplierId: 'SUP-0012', group: 'Bathroom Renovation', skill: 'Concealed water piping', level: 2, rate: '150 THB / meter', validTo: 'Dec 31, 2025', source: 'SkillVerify' },
  { supplierId: 'SUP-0067', group: 'Bathroom Renovation', skill: 'Floor and wall tiling', level: 3, rate: '600 THB / sq.m.', validTo: 'Sep 30, 2025', source: 'SkillVerify' },
  { supplierId: 'SUP-0124', group: 'Bathroom Renovation', skill: 'Bathroom floor leveling', level: 2, rate: '300 THB / sq.m.', validTo: 'Jun 30, 2025', source: 'TradeCheck' },
  { supplierId: 'SUP-0067', group: 'Bathroom Renovation', skill: 'Drainage system installation', level: 3, rate: '4,000 THB / point', validTo: 'Sep 30, 2025', source: 'SkillVerify' },
  { supplierId: 'SUP-0051', group: 'Industrial Packaging', skill: 'Export-grade packaging', level: 2, rate: '1,250 THB / pallet', validTo: 'Mar 31, 2025', source: 'TradeCheck' },
  { supplierId: 'SUP-0034', group: 'Electronics', skill: 'Control panel assembly', level: 3, rate: '2,200 THB / panel', validTo: 'Aug 31, 2025', source: 'TechAssess' },
  { supplierId: 'SUP-0089', group: 'IT Services', skill: 'Cloud infrastructure support', level: 2, rate: '1,800 THB / hour', validTo: 'May 31, 2025', source: 'TechAssess' },
];

const levelNames: Record<number, string> = { 1: 'Basic', 2: 'Qualified', 3: 'Advanced / Expert' };
const levelTones: Record<number, Tone> = { 1: 'warning', 2: 'success', 3: 'brand' };
const criterionTones: Record<string, Tone> = { Pass: 'success', Fail: 'danger', 'Review required': 'warning', 'Evidence pending': 'info' };

const views = [
  { value: 'pipeline', label: 'Qualification Pipeline' },
  { value: 'qsl', label: 'Qualified Supplier List' },
  { value: 'requalification', label: 'Requalification requests' },
] as const;

function ScopeCell({ row }: { row: QualificationRecord }) {
  return <CellStack primary={row.scope.category || row.category} tone="plain" secondary={[row.scope.plant, row.scope.businessUnit].filter(Boolean).join(' · ') || 'Not provided by source'} />;
}

export default function Qualification({ onOpenSupplier }: { onOpenSupplier: (supplier: Supplier) => void }) {
  const [view, setView] = useState<'pipeline' | 'qsl' | 'requalification'>('pipeline');
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('All technical groups');
  const [level, setLevel] = useState('All levels');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [selectedAssessment, setSelectedAssessment] = useState<QualificationRecord | null>(null);
  const groups = [...new Set(capabilities.map(item => item.group))];
  const qualified = capabilities.filter(item => {
    const supplier = supplierDirectory.find(entry => entry.id === item.supplierId);
    return qualificationRows.some(record => record.id === item.supplierId && record.status === 'Qualified') &&
      (`${supplier?.name} ${item.skill}`.toLowerCase().includes(search.toLowerCase())) &&
      (group === 'All technical groups' || item.group === group) &&
      (level === 'All levels' || item.level === Number(level));
  });
  const visibleQualificationRows = qualificationRows.filter(row =>
    (`${row.name} ${row.id} ${row.category}`.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'All statuses' || row.status === statusFilter)
  );
  const qualifiedSuppliers = qualificationRows.filter(row => row.status === 'Qualified');
  const visibleQualifiedSuppliers = qualifiedSuppliers.filter(row => `${row.name} ${row.category}`.toLowerCase().includes(search.toLowerCase()));

  const openSupplier = (id: string) => {
    const supplier = supplierDirectory.find(item => item.id === id);
    if (supplier) onOpenSupplier(supplier);
  };

  return (
    <Page>
      <Header breadcrumb={['Supplier lifecycle']} title="Supplier qualification" action={{ label: '+ New Assessment', onClick: () => setView('requalification') }} />
      <PageScroll>
        <div className="border-b border-line bg-surface px-4 md:px-6">
          <Tabs label="Qualification views" value={view} onChange={setView} items={[...views]} />
        </div>

        <PageBody>
          <KpiGrid cols={4}>
            <KpiCard label="Qualified suppliers" value={String(qualifiedSuppliers.length)} note="Available in QSL" tone="success" />
            <KpiCard label="Pending" value={String(qualificationRows.filter(row => row.status === 'Pending').length)} note="Awaiting assessment decision" tone="warning" />
            <KpiCard label="Expired" value={String(qualificationRows.filter(row => row.status === 'Expired').length)} note="Renewal required" tone="warning" />
            <KpiCard label="Rejected" value={String(qualificationRows.filter(row => row.status === 'Rejected').length)} note="Not eligible for QSL" tone="danger" />
          </KpiGrid>

          {view === 'pipeline' ? (
            <div className="space-y-5">
              <Card>
                <CardHeader
                  title="Active qualification campaigns"
                  description="Company qualification and technical capability assessments from integrated sources"
                />
                <CardBody>
                  <Grid cols={3}>
                    {campaigns.map(campaign => (
                      <div key={campaign.name} className="rounded-control border border-line p-4 transition-colors hover:border-brand-200">
                        <div className="text-body font-semibold text-ink">{campaign.name}</div>
                        <div className="mt-1 text-caption text-ink-muted">{campaign.scope} · Due {campaign.deadline}</div>
                        <div className="mt-4 flex items-center gap-3"><ProgressBar value={campaign.progress} size="md" label={`${campaign.name} progress`} className="flex-1" /><span className="text-caption font-semibold tabular-nums text-brand-700">{campaign.progress}%</span></div>
                        <div className="mt-2 text-caption text-ink-muted">{campaign.done} of {campaign.total} complete</div>
                      </div>
                    ))}
                  </Grid>
                </CardBody>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader
                  title="Qualification register"
                  description="Source status, approved scope, validity and latest assessment"
                  actions={
                    <Toolbar>
                      <SearchInput value={search} onChange={event => setSearch(event.target.value)} className="w-full sm:w-56" placeholder="Search supplier..." />
                      <Select aria-label="Filter by status" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
                        {['All statuses', 'Qualified', 'Pending', 'Expired', 'Rejected'].map(status => <option key={status}>{status}</option>)}
                      </Select>
                    </Toolbar>
                  }
                />
                <TableContainer>
                  <Table minWidth={1080}>
                    <HeadRow columns={['Supplier', 'Status', 'Qualification scope', 'Score', 'Valid from', 'Valid until', 'Last assessment', '']} />
                    <tbody>
                      {visibleQualificationRows.map(row => (
                        <Tr key={row.id}>
                          <Td><CellStack primary={row.name} secondary={row.id} mono /></Td>
                          <Td><StatusBadge status={row.status} small /></Td>
                          <Td><ScopeCell row={row} /></Td>
                          <Td className={cx('font-semibold tabular-nums', row.score == null ? 'font-normal text-ink-muted' : row.score >= 80 ? 'text-success-700' : row.score >= 65 ? 'text-warning-700' : 'text-danger-700')}>{row.score == null ? 'Not provided' : `${row.score}/100`}</Td>
                          <Td>{row.validFrom || 'Not provided'}</Td>
                          <Td>{row.validUntil || 'Not provided'}</Td>
                          <Td>{row.lastAssessment || 'Not provided'}</Td>
                          <Td><Button variant="link" onClick={() => setSelectedAssessment(row)}>Details</Button></Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </TableContainer>
                {visibleQualificationRows.length === 0 && <EmptyState title="No qualification records match these filters" />}
              </Card>
            </div>
          ) : view === 'qsl' ? (
            <div className="space-y-5">
              <Callout
                tone="info"
                title="Procurement selection view"
                actions={<div className="sm:text-right"><Eyebrow>Consolidated sync</Eyebrow><div className="mt-1 text-body text-ink-soft">Today, 10:45</div></div>}
              >
                Only externally verified qualifications and capabilities are published here for supplier selection.
              </Callout>
              <Card className="p-3">
                <Toolbar className="gap-3">
                  <SearchInput value={search} onChange={event => setSearch(event.target.value)} className="min-w-48 flex-1" placeholder="Search supplier or capability..." />
                  <Select aria-label="Technical group" value={group} onChange={event => setGroup(event.target.value)}><option>All technical groups</option>{groups.map(item => <option key={item}>{item}</option>)}</Select>
                  <Select aria-label="Skill level" value={level} onChange={event => setLevel(event.target.value)}><option>All levels</option><option value="1">Level 1 — Basic</option><option value="2">Level 2 — Qualified</option><option value="3">Level 3 — Advanced</option></Select>
                  <Button size="md">Compare suppliers</Button>
                </Toolbar>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader title="Qualified Supplier List" description="Only suppliers with a current Qualified status are included" />
                <TableContainer>
                  <Table minWidth={850}>
                    <HeadRow columns={['Supplier', 'Category', 'Qualification scope', 'Valid from', 'Valid until', 'Latest assessment', '']} />
                    <tbody>{visibleQualifiedSuppliers.map(row => (
                      <Tr key={row.id}>
                        <Td><CellStack primary={row.name} secondary={row.id} mono /></Td>
                        <Td>{row.category}</Td>
                        <Td><ScopeCell row={row} /></Td>
                        <Td>{row.validFrom || 'Not provided'}</Td>
                        <Td>{row.validUntil || 'Not provided'}</Td>
                        <Td>{row.lastAssessment || 'Not provided'}</Td>
                        <Td><Button variant="link" onClick={() => openSupplier(row.id)}>Open profile</Button></Td>
                      </Tr>
                    ))}</tbody>
                  </Table>
                </TableContainer>
                {visibleQualifiedSuppliers.length === 0 && <EmptyState title="No qualified suppliers match this search" />}
              </Card>
              <Card className="overflow-hidden">
                <CardHeader title="Qualified capabilities" description="Skills and approved rates for qualified suppliers" />
                <TableContainer>
                  <Table minWidth={900}>
                    <HeadRow columns={['Supplier', 'Technical group', 'Qualified skill', 'Skill level', 'Approved rate', 'Valid to', 'Source', '']} />
                    <tbody>
                      {qualified.map(row => {
                        const supplier = supplierDirectory.find(item => item.id === row.supplierId);
                        return (
                          <Tr key={`${row.supplierId}-${row.skill}`}>
                            <Td><CellStack primary={supplier?.name} secondary={`${row.supplierId} · ${supplier?.country}`} mono /></Td>
                            <Td className="text-ink-muted">{row.group}</Td>
                            <Td className="font-medium text-ink">{row.skill}</Td>
                            <Td><Badge tone={levelTones[row.level]} small>L{row.level} · {levelNames[row.level]}</Badge></Td>
                            <Td className="font-semibold text-ink">{row.rate}</Td>
                            <Td className="text-ink-muted">{row.validTo}</Td>
                            <Td className="text-ink-muted">{row.source}</Td>
                            <Td><Button variant="link" onClick={() => openSupplier(row.supplierId)}>Open profile</Button></Td>
                          </Tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </TableContainer>
                {qualified.length === 0 && <EmptyState title="No capabilities match these filters" />}
              </Card>
            </div>
          ) : (
            <Card className="overflow-hidden">
              <CardHeader title="Supplier requalification requests" description="Requests triggered by expiry, risk change or scheduled reassessment" />
              <TableContainer>
                <Table minWidth={1080}>
                  <HeadRow columns={['Request ID', 'Supplier', 'Reason', 'Request date', 'Qualification scope', 'Assessment status', 'Assessment result', 'Valid until', 'Expiry date']} />
                  <tbody>{requalificationRequests.map(request => {
                    const supplier = supplierDirectory.find(item => item.id === request.supplierId);
                    return <Tr key={request.id}>
                      <Td className="font-mono text-caption font-medium text-brand-700">{request.id}</Td>
                      <Td>
                        <button type="button" disabled={!supplier} onClick={() => supplier && onOpenSupplier(supplier)} className="rounded-sm text-left text-body font-medium text-brand-700 hover:underline disabled:text-ink-muted disabled:no-underline">{supplier?.name || request.supplierId}</button>
                        <div className="mt-0.5 text-caption text-ink-muted">{request.supplierId}</div>
                      </Td>
                      <Td>{request.reason}</Td>
                      <Td className="text-ink-muted">{request.requestDate}</Td>
                      <Td>{request.scope}</Td>
                      <Td><StatusBadge status={request.status} small /></Td>
                      <Td>{request.result}</Td>
                      <Td>{request.validUntil}</Td>
                      <Td>{request.expiryDate}</Td>
                    </Tr>;
                  })}</tbody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </PageBody>
      </PageScroll>
      {selectedAssessment && (
        <Modal
          title={selectedAssessment.name}
          eyebrow={`Qualification details · ${selectedAssessment.id}`}
          badge={<StatusBadge status={selectedAssessment.status} small />}
          closeLabel="Close details"
          onClose={() => setSelectedAssessment(null)}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ['Category', selectedAssessment.scope.category || selectedAssessment.category],
              ['Plant', selectedAssessment.scope.plant || 'Not provided by source'],
              ['Business unit', selectedAssessment.scope.businessUnit || 'Not provided by source'],
              ['Valid period', selectedAssessment.validFrom && selectedAssessment.validUntil ? `${selectedAssessment.validFrom} – ${selectedAssessment.validUntil}` : 'Not provided by source'],
            ].map(([label, value]) => <div key={label}><Eyebrow>{label}</Eyebrow><div className="mt-1 text-body text-ink">{value}</div></div>)}
          </div>
          {selectedAssessment.reason && <Callout tone="warning" title="Decision context">{selectedAssessment.reason}</Callout>}
          <section>
            <h3 className="text-sm font-semibold text-ink">Assessment criteria</h3>
            {selectedAssessment.criteria?.length ? (
              <TableContainer className="mt-3 rounded-control border border-line">
                <Table minWidth={420}>
                  <thead><tr><Th>Criterion</Th><Th>Result</Th><Th>Score</Th></tr></thead>
                  <tbody>{selectedAssessment.criteria.map(criterion => <Tr key={criterion.name}><Td dense>{criterion.name}</Td><Td dense>{criterionTones[criterion.result] ? <Badge tone={criterionTones[criterion.result]} small>{criterion.result}</Badge> : criterion.result}</Td><Td dense>{criterion.score || 'Not provided'}</Td></Tr>)}</tbody>
                </Table>
              </TableContainer>
            ) : <p className="mt-2 text-caption text-ink-muted">Assessment criteria not provided by source.</p>}
          </section>
          <section>
            <h3 className="text-sm font-semibold text-ink">Assessment history</h3>
            {selectedAssessment.history?.length ? (
              <ol className="mt-3 space-y-3">{selectedAssessment.history.map((assessment, index) => <li key={`${assessment.date}-${index}`} className="flex gap-3 border-l-2 border-brand-200 pl-3"><div className="min-w-24 text-caption text-ink-muted">{assessment.date}</div><div><div className="text-body font-medium text-ink">{assessment.result}</div><div className="mt-0.5 text-caption text-ink-muted">{assessment.note || 'No decision note provided'}</div></div></li>)}</ol>
            ) : <p className="mt-2 text-caption text-ink-muted">Previous assessment history not provided by source.</p>}
          </section>
        </Modal>
      )}
    </Page>
  );
}
