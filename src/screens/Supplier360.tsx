import { useState, type ReactNode } from 'react';
import Header from '../components/Header';
import ComplianceTracker from '../components/ComplianceTracker';
import StatusBadge from '../components/StatusBadge';
import { Supplier } from '../data/suppliers';
import { useNavigation } from '../NavigationContext';
import { Avatar, BackLink, Badge, Button, Callout, Card, CardBody, CardHeader, DetailGrid, Eyebrow, Grid, HeadRow, KpiGrid, Page, PageBody, PageScroll, ProgressBar, Stepper, Table, TableContainer, Tabs, Td, Tr, cx, toneFill, type StepState, type Tone } from '../components/ui';

const tabs = ['Overview', 'Profile', 'Capabilities', 'Qualification', 'Risk', 'Performance', 'Compliance', 'Audit', 'CAR', 'Activities'];

const lifecycleStages = ['Registered', 'Onboarded', 'Qualified', 'Approved', 'Active'];

const lifecycleDates: Record<string, Record<string, string>> = {
  'SUP-0012': { Registered: 'Jan 12, 2021', Onboarded: 'Feb 3, 2021', Qualified: 'Mar 15, 2021', Approved: 'Apr 1, 2021', Active: 'Since Apr 1, 2021' },
};

const requalificationHint = 'Optional step for suppliers that must be re-verified, for example after an expired certificate, a risk change or a scheduled reassessment. Locked until a requalification is requested.';

// Checks that run while a supplier is Active, not sequential stages.
const ongoingMonitoring = ['Risk review · Sep 2, 2024', 'Performance review · Aug 20, 2024', 'Audit · 3 open findings', 'CAR · 2 open'];

function lifecycleFor(supplier: Supplier): { label: string; caption: string; state: StepState; hint?: string }[] {
  const qualification = supplier.qualificationStatus || supplier.qual;
  const needsRequalification = supplier.status === 'Active' && (qualification === 'Pending' || qualification === 'Expired');
  const current = supplier.status === 'Draft' ? 0 : supplier.status === 'Pending' || supplier.status === 'Rejected' ? 2 : lifecycleStages.length;
  const dates = lifecycleDates[supplier.id] ?? {};
  const stages = lifecycleStages.map((stage, index) => {
    const state: StepState = index < current ? 'done' : index === current ? 'active' : 'todo';
    const fallback = state === 'done' ? 'Completed' : state === 'active' ? (supplier.status === 'Rejected' ? 'Not passed' : 'In progress') : 'Not started';
    return { label: stage, caption: dates[stage] ?? fallback, state };
  });
  return [...stages, { label: 'Requalification', caption: needsRequalification ? 'Required' : 'Not required', state: 'locked', hint: requalificationHint }];
}

const activities = [
  { date: 'Sep 2, 2024', event: 'Risk score updated after financial review', area: 'Risk' },
  { date: 'Aug 20, 2024', event: 'Q2 performance review submitted', area: 'Performance' },
  { date: 'Jul 1, 2024', event: 'CAR-2024-118 issued for a quality defect', area: 'CAR' },
  { date: 'May 15, 2024', event: 'Annual requalification assessment started', area: 'Qualification' },
  { date: 'Mar 10, 2024', event: 'Supply continuity review completed', area: 'Relationship' },
  { date: 'Jan 12, 2024', event: 'ISO 9001 certificate renewed', area: 'Document' },
];

const badgeColumns = ['Result', 'Status', 'Decision', 'Verification', 'Rating', 'Severity', 'CAP'];
const cellTones: Record<string, Tone> = {
  Pass: 'success', Compliant: 'success', Verified: 'success', Approved: 'success', Closed: 'success', 'On target': 'success', Low: 'success',
  Conditional: 'warning', Expiring: 'warning', 'Near target': 'warning', Medium: 'warning', Minor: 'warning', 'Supplier response': 'warning', 'Awaiting supplier': 'warning',
  High: 'danger', Major: 'danger', Missing: 'danger', Overdue: 'danger', 'Below target': 'danger', 'Revision requested': 'danger',
  'Under review': 'info', 'In progress': 'info', 'CAR raised': 'info', Open: 'info',
};

function riskBadgeTone(risk: string): Tone {
  return risk === 'Critical' || risk === 'High Risk' ? 'danger' : risk === 'Medium Risk' ? 'warning' : 'success';
}

function SectionCard({ title, action, onAction, children, className = '' }: { title: string; action?: string; onAction?: () => void; children: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader title={title} actions={action && <Button variant="link" onClick={onAction}>{action}</Button>} />
      <CardBody>{children}</CardBody>
    </Card>
  );
}

function ScoreCard({ label, value, tone, note }: { label: string; value: string; tone: Tone; note: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="text-caption font-medium text-ink-muted">{label}</div>
        <span aria-hidden="true" className={cx('mt-1 h-2 w-2 shrink-0 rounded-full', toneFill[tone])} />
      </div>
      <div className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">{value}</div>
      <div className="mt-1 text-caption text-ink-muted">{note}</div>
    </Card>
  );
}

function SimpleTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <TableContainer className="rounded-control border border-line">
      <Table minWidth={columns.length * 120}>
        <HeadRow columns={columns} />
        <tbody>
          {rows.map((row, index) => (
            <Tr key={index}>
              {row.map((cell, cellIndex) => (
                <Td key={cellIndex} dense className={cx(cellIndex === 0 && 'font-medium text-ink')}>
                  {badgeColumns.includes(columns[cellIndex]) && cellTones[cell] ? <Badge tone={cellTones[cell]} small>{cell}</Badge> : cell}
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

export default function Supplier360({ supplier, onBack }: { supplier: Supplier; onBack: () => void }) {
  const [tab, setTab] = useState('Overview');
  const { navigate } = useNavigation();
  const riskValue = supplier.risk === 'Critical' ? 78 : supplier.risk === 'High Risk' ? 68 : supplier.risk === 'Medium Risk' ? 46 : 24;
  const qualificationStatus = supplier.qualificationStatus || supplier.qual;
  const isQualified = qualificationStatus === 'Qualified';
  const health = supplier.perf ? Math.round((supplier.perf + (100 - riskValue) + (isQualified ? 92 : 58)) / 3) : 42;
  const initials = supplier.name.split(' ').slice(0, 2).map(word => word[0]).join('');
  const riskTone: Tone = supplier.risk === 'Critical' || supplier.risk === 'High Risk' ? 'danger' : supplier.risk === 'Medium Risk' ? 'warning' : 'success';

  const renderTab = () => {
    if (tab === 'Overview') {
      return (
        <div className="space-y-5">
          <KpiGrid cols={5}>
            <ScoreCard label="Health score" value={`${health}/100`} tone={health >= 75 ? 'success' : 'warning'} note="Combined lifecycle health" />
            <ScoreCard label="Risk score" value={`${riskValue}/100`} tone={riskTone} note={`${supplier.risk} · ↑ 8 this quarter`} />
            <ScoreCard label="Performance" value={supplier.perf ? `${supplier.perf}%` : 'N/A'} tone={supplier.perf >= 80 ? 'success' : 'warning'} note="Q2 weighted score" />
            <ScoreCard label="Qualification" value={qualificationStatus} tone={isQualified ? 'success' : 'warning'} note="Review due Dec 15, 2024" />
            <ScoreCard label="Compliance" value="82%" tone="success" note="9 of 11 requirements valid" />
          </KpiGrid>

          <Grid cols="split5">
            <SectionCard title="Needs attention" action="View all" className="xl:col-span-3">
              <div className="space-y-2">
                {[
                  ['Critical', 'Financial risk increased after the latest credit review', 'Review assessment'],
                  ['High', 'ISO 14001 certificate expires in 83 days', 'Request renewal'],
                  ['Medium', 'CAR-2024-118 is 5 days overdue', 'Follow up'],
                ].map(item => (
                  <div key={item[1]} className="flex flex-wrap items-center gap-3 rounded-control bg-canvas p-3">
                    <span aria-hidden="true" className={cx('h-8 w-1 shrink-0 rounded-full', item[0] === 'Critical' ? 'bg-danger-500' : item[0] === 'High' ? 'bg-warning-600' : 'bg-warning-500')} />
                    <div className="min-w-0 flex-1">
                      <div className="text-caption font-semibold text-ink">{item[0]}</div>
                      <div className="mt-0.5 text-caption text-ink-muted">{item[1]}</div>
                    </div>
                    <Button variant="link">{item[2]} →</Button>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Open work" action="Manage tasks" className="xl:col-span-2">
              <div className="space-y-3">
                {[
                  ['Open CAR', '2', '1 overdue'],
                  ['Audit findings', '3', 'Due this month'],
                  ['Missing documents', '2', 'Supplier notified'],
                  ['Capability requests', '2', 'External verification'],
                ].map(item => (
                  <div key={item[0]} className="flex items-center justify-between border-b border-line-subtle pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="text-body font-medium text-ink-soft">{item[0]}</div>
                      <div className="mt-0.5 text-caption text-ink-muted">{item[2]}</div>
                    </div>
                    <div className="text-lg font-semibold tabular-nums text-ink">{item[1]}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </Grid>

          <SectionCard title="Supplier lifecycle" action="View complete history">
            <Stepper steps={lifecycleFor(supplier)} />
            {supplier.status === 'Active' && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line-subtle pt-4">
                <Eyebrow className="shrink-0">Ongoing while active</Eyebrow>
                {ongoingMonitoring.map(item => <Badge key={item} small>{item}</Badge>)}
              </div>
            )}
            <p className="mt-3 text-caption text-ink-muted">Active is the end of the main flow. Requalification is an optional follow-up step that stays locked until a supplier must be re-verified.</p>
          </SectionCard>

          <Grid cols="split5">
            <SectionCard title="Digital passport" action="Open profile" className="xl:col-span-2">
              <DetailGrid items={[
                { label: 'Legal name', value: supplier.name.replace('Ltd', 'GmbH') },
                { label: 'Registration', value: `${supplier.country.slice(0, 2).toUpperCase()}-2018-04532` },
                { label: 'Category', value: supplier.category },
                { label: 'Country', value: supplier.country },
                { label: 'Tier', value: 'Tier 1 · Strategic' },
                { label: 'Owner', value: supplier.owner },
              ]} />
            </SectionCard>
            <SectionCard title="Recent activity" action="View activity log" className="xl:col-span-3">
              <ul className="space-y-3">
                {activities.slice(0, 4).map(activity => (
                  <li key={activity.date + activity.event} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <div className="w-24 text-caption text-ink-muted">{activity.date}</div>
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    <div className="min-w-0 flex-1 text-body text-ink-soft">{activity.event}</div>
                    <Badge small>{activity.area}</Badge>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </Grid>
        </div>
      );
    }

    if (tab === 'Profile') return (
      <Grid cols="split3">
        <SectionCard title="Company information" action="Edit" className="xl:col-span-2">
          <DetailGrid items={[
            { label: 'Legal name', value: supplier.name },
            { label: 'Trading name', value: supplier.name.replace(' Ltd', '') },
            { label: 'Supplier ID', value: supplier.id },
            { label: 'Registration number', value: 'DE-2018-04532' },
            { label: 'Tax ID', value: 'DE299124756' },
            { label: 'D-U-N-S number', value: '123-456-789' },
            { label: 'Founded', value: '1987' },
            { label: 'Employees', value: '2,400' },
            { label: 'Annual revenue', value: '€340M (FY 2023)' },
            { label: 'Website', value: 'www.titan-industries.example' },
            { label: 'Registered address', value: `Industriestrasse 42, 40210 Düsseldorf, ${supplier.country}`, wide: true },
          ]} />
        </SectionCard>
        <div className="space-y-4">
          <SectionCard title="Classification" action="Manage">
            <DetailGrid items={[
              { label: 'Category', value: supplier.category },
              { label: 'Additional category', value: 'Facilities Services' },
              { label: 'Tier', value: 'Tier 1' },
              { label: 'Segment', value: 'Strategic' },
              { label: 'Spend band', value: '€10M–€25M' },
              { label: 'Region', value: 'EMEA' },
              { label: 'Criticality', value: 'Business critical' },
            ]} />
          </SectionCard>
          <SectionCard title="Primary contact" action="View contacts">
            <div className="mb-4 flex items-center gap-3">
              <Avatar initials="AM" size="lg" />
              <div><div className="text-body font-semibold text-ink">Anna Müller</div><div className="text-caption text-ink-muted">Commercial Director</div></div>
            </div>
            <div className="space-y-1.5 text-body text-ink-soft"><div>anna.mueller@example.com</div><div>+49 211 555 0182</div></div>
          </SectionCard>
        </div>
        <SectionCard title="Banking & payment" action="Restricted · View" className="xl:col-span-2">
          <DetailGrid items={[
            { label: 'Payment terms', value: 'Net 45' },
            { label: 'Currency', value: 'EUR' },
            { label: 'Bank verification', value: 'Verified Sep 1, 2024' },
            { label: 'ERP vendor ID', value: 'V-1004832' },
          ]} />
        </SectionCard>
        <SectionCard title="Internal ownership" action="Reassign">
          <DetailGrid items={[
            { label: 'Supplier owner', value: supplier.owner },
            { label: 'Business unit', value: 'Global Procurement' },
            { label: 'Category manager', value: 'Sophie Chen' },
            { label: 'Last reviewed', value: supplier.lastReview },
          ]} />
        </SectionCard>
      </Grid>
    );

    if (tab === 'Capabilities') return (
      <div className="space-y-5">
        <Callout
          tone="info"
          title="Capability and product scope"
          actions={
            <>
              <Button>View source data</Button>
              <Button variant="primary">Register new capability</Button>
            </>
          }
        >
          Approved capabilities are available in QSL. New products or business categories remain pending until the external source verifies them.
        </Callout>

        <KpiGrid cols={4}>
          <ScoreCard label="Approved skills" value="5" tone="success" note="Published to QSL" />
          <ScoreCard label="Product categories" value="2" tone="info" note="1 primary · 1 additional" />
          <ScoreCard label="Pending verification" value="2" tone="warning" note="Not available in QSL yet" />
          <ScoreCard label="Rate cards" value="5" tone="success" note="Last synced today, 10:42" />
        </KpiGrid>

        <Grid cols="split5">
          <SectionCard title="Approved technical capabilities" action="Open in QSL" className="xl:col-span-3">
            <SimpleTable columns={['Technical group / skill', 'Level', 'Approved rate', 'Valid to']} rows={[
              ['Bathroom Renovation · Sanitary ware installation', 'L3 · Advanced', '800 THB / set', 'Dec 31, 2025'],
              ['Bathroom Renovation · Concealed water piping', 'L2 · Qualified', '150 THB / meter', 'Dec 31, 2025'],
              ['Bathroom Renovation · Floor and wall tiling', 'L2 · Qualified', '450 THB / sq.m.', 'Dec 31, 2025'],
              ['Bathroom Renovation · Bathroom floor leveling', 'L1 · Basic', '250 THB / sq.m.', 'Dec 31, 2025'],
              ['Bathroom Renovation · Drainage installation', 'L2 · Qualified', '2,500 THB / point', 'Dec 31, 2025'],
            ]} />
          </SectionCard>

          <SectionCard title="Registered business scope" action="View catalog" className="xl:col-span-2">
            <div className="space-y-3">
              {[
                ['Raw Materials', 'Primary category', 'Approved'],
                ['Facilities Services', 'Additional category', 'Approved'],
              ].map(item => (
                <div key={item[0]} className="flex items-center justify-between gap-3 rounded-control border border-line p-3">
                  <div><div className="text-body font-medium text-ink">{item[0]}</div><div className="mt-0.5 text-caption text-ink-muted">{item[1]}</div></div>
                  <StatusBadge status={item[2]} small />
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-line-subtle pt-4">
              <Eyebrow className="mb-2">Registered products</Eyebrow>
              <div className="flex flex-wrap gap-2">
                {['Steel fasteners', 'Pipe fittings', 'Sanitary ware', 'Drainage components'].map(product => <Badge key={product} small>{product}</Badge>)}
              </div>
            </div>
          </SectionCard>
        </Grid>

        <SectionCard title="New product & capability registrations" action="+ Submit registration">
          <div className="space-y-3">
            {[
              { title: 'Smart sanitary ware installation', type: 'New technical capability', submitted: 'Sep 6, 2024', source: 'SkillVerify', status: 'Under review', next: 'Site capability assessment scheduled Sep 18' },
              { title: 'Commercial HVAC components', type: 'New product category', submitted: 'Sep 2, 2024', source: 'TradeCheck', status: 'More information', next: 'Product certification documents required' },
            ].map(request => (
              <div key={request.title} className="grid grid-cols-1 items-center gap-4 rounded-control border border-line bg-canvas p-4 md:grid-cols-6">
                <div className="md:col-span-2"><div className="text-body font-semibold text-ink">{request.title}</div><div className="mt-1 text-caption text-ink-muted">{request.type} · Submitted {request.submitted}</div></div>
                <div><Eyebrow>Verification source</Eyebrow><div className="mt-1 text-body text-ink-soft">{request.source}</div></div>
                <div><StatusBadge status={request.status === 'Under review' ? 'In Progress' : 'Pending'} small /></div>
                <div className="md:col-span-2"><Eyebrow>Next step</Eyebrow><div className="mt-1 text-body text-ink-soft">{request.next}</div></div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );

    if (tab === 'Qualification') return (
      <Grid cols="split3">
        <SectionCard title="Qualification status">
          <div className="mb-5 flex flex-wrap items-center gap-3"><StatusBadge status={qualificationStatus} /><span className="text-caption text-ink-muted">Valid through Dec 15, 2024</span></div>
          <DetailGrid columns={1} items={[{ label: 'Assessment score', value: '86 / 100' }, { label: 'Decision', value: qualificationStatus }, { label: 'Approved by', value: 'Procurement Board' }, { label: 'Requalification', value: 'Dec 1, 2024' }]} />
        </SectionCard>
        <SectionCard title="Assessment breakdown" action="Open assessment" className="xl:col-span-2">
          <SimpleTable columns={['Section', 'Score', 'Weight', 'Result']} rows={[
            ['Financial stability', '72%', '25%', 'Conditional'], ['Quality capability', '94%', '30%', 'Pass'], ['Operational capacity', '88%', '20%', 'Pass'], ['ESG & ethics', '84%', '15%', 'Pass'], ['Information security', '91%', '10%', 'Pass'],
          ]} />
        </SectionCard>
        <SectionCard title="Approval history" className="xl:col-span-3">
          <SimpleTable columns={['Stage', 'Approver', 'Decision', 'Date']} rows={[
            ['Category review', 'Sophie Chen', 'Approved', 'Mar 10, 2021'], ['Quality review', 'David Park', 'Approved', 'Mar 12, 2021'], ['Finance review', 'Elena Rossi', 'Conditional', 'Mar 14, 2021'], ['Final approval', 'Procurement Board', 'Approved', 'Mar 15, 2021'],
          ]} />
        </SectionCard>
      </Grid>
    );

    if (tab === 'Risk') return (
      <Grid cols="split3">
        <SectionCard title="Overall risk">
          <div className="text-3xl font-semibold tracking-tight text-ink">{riskValue}<span className="text-base font-normal text-ink-muted">/100</span></div>
          <div className="mt-2"><Badge tone={riskBadgeTone(supplier.risk)}>{supplier.risk}</Badge></div>
          <div className="mt-5 text-caption text-ink-muted">Trend increased 8 points this quarter. Confidence: high.</div>
        </SectionCard>
        <SectionCard title="Risk drivers" action="Run assessment" className="xl:col-span-2">
          <SimpleTable columns={['Risk domain', 'Rating', 'Trend', 'Last updated']} rows={[
            ['Financial', 'High', 'Increasing', 'Sep 2, 2024'], ['Supply continuity', 'Medium', 'Stable', 'Aug 18, 2024'], ['Geopolitical', 'Low', 'Stable', 'Sep 1, 2024'], ['Cyber security', 'Low', 'Improving', 'Jul 28, 2024'], ['ESG', 'Medium', 'Stable', 'Aug 12, 2024'],
          ]} />
        </SectionCard>
        <SectionCard title="Recommended mitigation" action="Create action" className="xl:col-span-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {['Request updated audited financials', 'Confirm alternate production capacity', 'Increase monitoring to monthly cadence'].map((item, index) => (
              <div key={item} className="rounded-control border border-brand-100 bg-brand-50 p-4"><div className="mb-1 text-micro font-semibold uppercase tracking-wide text-brand-700">Next best action {index + 1}</div><div className="text-body font-medium text-ink">{item}</div></div>
            ))}
          </div>
        </SectionCard>
      </Grid>
    );

    if (tab === 'Performance') return (
      <div className="space-y-5">
        <KpiGrid cols={4}>
          <ScoreCard label="Overall score" value={`${supplier.perf || 0}%`} tone="warning" note="↓ 4.2 vs previous quarter" />
          <ScoreCard label="Quality" value="71%" tone="warning" note="Target 95%" />
          <ScoreCard label="Delivery" value="58%" tone="danger" note="Target 92%" />
          <ScoreCard label="Service" value="84%" tone="success" note="Target 85%" />
        </KpiGrid>
        <SectionCard title="KPI scorecard" action="Open Q2 review">
          <SimpleTable columns={['KPI', 'Actual', 'Target', 'Trend', 'Status']} rows={[
            ['On-time delivery', '82.4%', '≥ 95%', 'Down 7.1%', 'Below target'], ['Defect rate', '2.8%', '≤ 1.0%', 'Up 0.6%', 'Below target'], ['Lead-time adherence', '89%', '≥ 90%', 'Stable', 'Near target'], ['Response time', '4.2 hrs', '≤ 8 hrs', 'Improving', 'On target'],
          ]} />
        </SectionCard>
      </div>
    );

    if (tab === 'Compliance') {
      return (
        <div className="space-y-5">
          <Grid cols="split3">
            <SectionCard title="Compliance coverage">
              <div className="text-3xl font-semibold tracking-tight text-ink">82%</div>
              <ProgressBar value={82} tone="success" size="md" label="Compliance coverage" className="mt-3" />
              <div className="mt-3 text-caption text-ink-muted">9 valid · 1 expiring · 1 missing</div>
            </SectionCard>
            <SectionCard title="Requirements" action="Request update" className="xl:col-span-2">
              <SimpleTable columns={['Requirement', 'Status', 'Owner', 'Next review']} rows={[
                ['Code of conduct', 'Compliant', 'Legal', 'Jan 12, 2025'], ['Modern slavery declaration', 'Compliant', 'ESG', 'Mar 1, 2025'], ['Environmental policy', 'Expiring', 'ESG', 'Dec 1, 2024'], ['Conflict minerals report', 'Missing', 'Compliance', 'Overdue'],
              ]} />
            </SectionCard>
          </Grid>
          <Card className="overflow-hidden">
            <CardHeader title="Compliance tracker" description="Documents, contracts, audits, questionnaires, screening and sample requests" actions={<Button variant="link" onClick={() => navigate('compliance')}>View in Compliance</Button>} />
            <ComplianceTracker key={supplier.id} companyId={supplier.id} />
          </Card>
        </div>
      );
    }

    if (tab === 'Audit') return (
      <Grid cols="split3">
        <SectionCard title="Audit summary">
          <DetailGrid columns={1} items={[{ label: 'Last audit', value: 'Jul 18, 2024' }, { label: 'Result', value: 'Conditional pass' }, { label: 'Score', value: '78 / 100' }, { label: 'Open findings', value: '3' }, { label: 'Next audit', value: 'Jan 20, 2025' }, { label: 'Audit owner', value: 'David Park' }]} />
        </SectionCard>
        <SectionCard title="Findings" action="View audit report" className="xl:col-span-2">
          <SimpleTable columns={['Finding', 'Severity', 'Owner', 'Status']} rows={[
            ['Calibration records incomplete', 'Major', 'Quality Lead', 'CAR raised'], ['Training matrix out of date', 'Minor', 'HR Manager', 'In progress'], ['Waste log retention gap', 'Minor', 'EHS Manager', 'Open'],
          ]} />
        </SectionCard>
      </Grid>
    );

    if (tab === 'CAR') return (
      <div className="space-y-5">
        <KpiGrid cols={4}>
          <ScoreCard label="Open CAR" value="2" tone="info" note="Across quality and delivery" />
          <ScoreCard label="Overdue" value="1" tone="danger" note="5 days overdue" />
          <ScoreCard label="Pending supplier" value="1" tone="warning" note="Response requested" />
          <ScoreCard label="Closed this year" value="6" tone="success" note="Avg. closure 18 days" />
        </KpiGrid>
        <SectionCard title="CAR & CAP" action="+ Create CAR">
          <SimpleTable columns={['CAR', 'Issue', 'Severity', 'Due date', 'CAP', 'Status']} rows={[
            ['CAR-2024-118', 'Quality defect rate above threshold', 'High', 'Sep 25, 2024', 'Approved', 'Overdue'], ['CAR-2024-087', 'Repeated delivery delays', 'Medium', 'Oct 18, 2024', 'Under review', 'Supplier response'], ['CAR-2024-041', 'Incomplete inspection records', 'Low', 'May 30, 2024', 'Approved', 'Closed'],
          ]} />
        </SectionCard>
      </div>
    );

    return (
      <SectionCard title="Complete activity log" action="Export">
        <ul>
          {activities.map(activity => (
            <li key={activity.date + activity.event} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line-subtle py-3 last:border-0">
              <div className="w-24 text-caption text-ink-muted">{activity.date}</div>
              <Avatar initials={activity.area.slice(0, 2).toUpperCase()} />
              <div className="min-w-0 flex-1"><div className="text-body font-medium text-ink">{activity.event}</div><div className="mt-0.5 text-caption text-ink-muted">Updated by System · {activity.area}</div></div>
              <Button variant="link">View details</Button>
            </li>
          ))}
        </ul>
      </SectionCard>
    );
  };

  return (
    <Page>
      <Header breadcrumb={['Supplier Management', 'Supplier Directory', supplier.id]} title={supplier.name} />
      <PageScroll>
        <div className="border-b border-line bg-surface px-4 pt-4 md:px-6">
          <BackLink onClick={onBack}>Back to supplier directory</BackLink>
          <div className="mb-4 mt-3 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar initials={initials} size="xl" shape="square" />
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <div className="text-lg font-semibold text-ink">{supplier.name}</div>
                  <StatusBadge status={supplier.status} />
                  <Badge tone={riskTone}>{supplier.risk}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-ink-muted">
                  <span className="font-mono">{supplier.id}</span><span>{supplier.category} · {supplier.country}</span><span>Owner: {supplier.owner}</span><span>Tier 1 Strategic</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="md">Edit profile</Button>
            </div>
          </div>
          <Tabs label="Supplier sections" value={tab} onChange={setTab} items={tabs.map(item => ({ value: item, label: item === 'CAR' ? 'CAR & CAP' : item }))} />
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto border-t border-line-subtle py-2.5">
            <Eyebrow className="shrink-0">Related modules</Eyebrow>
            {[
              ['Qualification', 'qualification'], ['Risk', 'risk'], ['Compliance', 'compliance'],
              ['Performance', 'performance'], ['Audit', 'audit'], ['CAR & CAP', 'car'],
              ['Contacts', 'relationship'],
            ].map(([label, screen]) => <Button key={screen} size="xs" onClick={() => navigate(screen as 'qualification' | 'risk' | 'compliance' | 'performance' | 'audit' | 'car' | 'relationship')}>{label}</Button>)}
          </div>
        </div>
        <PageBody>{renderTab()}</PageBody>
      </PageScroll>
    </Page>
  );
}
