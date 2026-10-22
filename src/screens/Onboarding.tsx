import { useState } from 'react';
import Header from '../components/Header';
import SampleRequests, { sampleStatusTone } from '../components/SampleRequests';
import { ArrowRightIcon } from '../components/icons';
import StatusBadge from '../components/StatusBadge';
import { isSampleOpen, sampleRequests, type SampleRequest } from '../data/samples';
import { Avatar, BackLink, Badge, Button, Callout, Card, CardBody, CardHeader, CellStack, EmptyState, Grid, HeadRow, KpiCard, KpiGrid, Page, PageContent, ProgressBar, SearchInput, Select, Stepper, Table, TableContainer, Td, Toolbar, Tr, cx, toneFill, type Tone } from '../components/ui';

type DocumentStatus = 'Verified' | 'Under review' | 'Missing' | 'Rejected';

type OnboardingCompany = {
  name: string;
  id: string;
  category: string;
  country: string;
  requestType: string;
  owner: string;
  step: string;
  progress: number;
  started: string;
  days: number;
  source: string;
  lastSync: string;
  syncStatus: 'Synced' | 'Sync delayed';
  documents: { name: string; required: boolean; status: DocumentStatus; updated: string; note: string }[];
};

const companies: OnboardingCompany[] = [
  {
    name: 'Apex Components Inc',
    id: 'SUP-0034',
    category: 'Electronics',
    country: 'Taiwan',
    requestType: 'New supplier',
    owner: 'M. Patel',
    step: 'Documents',
    progress: 42,
    started: 'Sep 1, 2024',
    days: 8,
    source: 'VendorVerify',
    lastSync: 'Today, 10:42',
    syncStatus: 'Synced',
    documents: [
      { name: 'Certificate of Incorporation', required: true, status: 'Verified', updated: 'Sep 3', note: 'Verified by VendorVerify' },
      { name: 'Tax Registration Certificate', required: true, status: 'Verified', updated: 'Sep 3', note: 'Verified by VendorVerify' },
      { name: 'ISO 9001 Certificate', required: true, status: 'Under review', updated: 'Sep 7', note: 'Submitted to third-party verifier' },
      { name: 'Bank Reference Letter', required: true, status: 'Missing', updated: '—', note: 'Not received from supplier' },
      { name: 'Financial Statements (2 years)', required: true, status: 'Missing', updated: '—', note: 'Not received from supplier' },
      { name: 'Insurance Certificate', required: false, status: 'Verified', updated: 'Sep 4', note: 'Verified by VendorVerify' },
      { name: 'ESG Policy Statement', required: false, status: 'Missing', updated: '—', note: 'Optional document' },
    ],
  },
  {
    name: 'Vertex Systems',
    id: 'SUP-0089',
    category: 'IT Services',
    country: 'India',
    requestType: 'New supplier',
    owner: 'A. Singh',
    step: 'Registration',
    progress: 15,
    started: 'Sep 6, 2024',
    days: 3,
    source: 'TrustDocs',
    lastSync: 'Today, 10:38',
    syncStatus: 'Synced',
    documents: [
      { name: 'Certificate of Incorporation', required: true, status: 'Under review', updated: 'Sep 8', note: 'Submitted to TrustDocs' },
      { name: 'Tax Registration Certificate', required: true, status: 'Missing', updated: '—', note: 'Not received from supplier' },
      { name: 'Information Security Policy', required: true, status: 'Missing', updated: '—', note: 'Not received from supplier' },
      { name: 'Cyber Insurance Certificate', required: true, status: 'Missing', updated: '—', note: 'Not received from supplier' },
    ],
  },
  {
    name: 'Nortech AG',
    id: 'SUP-0156',
    category: 'Industrial Equipment',
    country: 'Switzerland',
    requestType: 'Requalification',
    owner: 'K. Bauer',
    step: 'Qualification',
    progress: 68,
    started: 'Aug 26, 2024',
    days: 14,
    source: 'VendorVerify',
    lastSync: 'Yesterday, 18:10',
    syncStatus: 'Sync delayed',
    documents: [
      { name: 'Certificate of Incorporation', required: true, status: 'Verified', updated: 'Aug 28', note: 'Verified by VendorVerify' },
      { name: 'Tax Registration Certificate', required: true, status: 'Verified', updated: 'Aug 28', note: 'Verified by VendorVerify' },
      { name: 'ISO 9001 Certificate', required: true, status: 'Verified', updated: 'Aug 30', note: 'Verified by VendorVerify' },
      { name: 'Financial Statements (2 years)', required: true, status: 'Verified', updated: 'Sep 1', note: 'Verified by VendorVerify' },
      { name: 'Product Liability Insurance', required: true, status: 'Rejected', updated: 'Sep 6', note: 'Coverage value below requirement' },
    ],
  },
  {
    name: 'Solaris Parts',
    id: 'SUP-0177',
    category: 'Mechanical',
    country: 'Spain',
    requestType: 'New supplier',
    owner: 'J. Kim',
    step: 'Review',
    progress: 82,
    started: 'Aug 20, 2024',
    days: 20,
    source: 'TrustDocs',
    lastSync: 'Today, 09:55',
    syncStatus: 'Synced',
    documents: [
      { name: 'Certificate of Incorporation', required: true, status: 'Verified', updated: 'Aug 22', note: 'Verified by TrustDocs' },
      { name: 'Tax Registration Certificate', required: true, status: 'Verified', updated: 'Aug 22', note: 'Verified by TrustDocs' },
      { name: 'ISO 9001 Certificate', required: true, status: 'Verified', updated: 'Aug 25', note: 'Verified by TrustDocs' },
      { name: 'Financial Statements (2 years)', required: true, status: 'Verified', updated: 'Aug 27', note: 'Verified by TrustDocs' },
      { name: 'Insurance Certificate', required: true, status: 'Under review', updated: 'Sep 8', note: 'Submitted to TrustDocs' },
    ],
  },
  {
    name: 'Eastgate Manufacturing',
    id: 'SUP-0184',
    category: 'Packaging',
    country: 'Vietnam',
    requestType: 'New supplier',
    owner: 'S. Chen',
    step: 'Approval',
    progress: 91,
    started: 'Aug 18, 2024',
    days: 22,
    source: 'VendorVerify',
    lastSync: 'Today, 10:40',
    syncStatus: 'Synced',
    documents: [
      { name: 'Certificate of Incorporation', required: true, status: 'Verified', updated: 'Aug 20', note: 'Verified by VendorVerify' },
      { name: 'Tax Registration Certificate', required: true, status: 'Verified', updated: 'Aug 20', note: 'Verified by VendorVerify' },
      { name: 'ISO 9001 Certificate', required: true, status: 'Verified', updated: 'Aug 23', note: 'Verified by VendorVerify' },
      { name: 'Financial Statements (2 years)', required: true, status: 'Verified', updated: 'Aug 24', note: 'Verified by VendorVerify' },
      { name: 'Insurance Certificate', required: true, status: 'Verified', updated: 'Aug 24', note: 'Verified by VendorVerify' },
    ],
  },
];

const stepNames = ['Registration', 'Information', 'Documents', 'Qualification', 'Review', 'Approval', 'Activated'];
const statusHistory: Record<string, { date: string; status: string; source: string }[]> = {
  'SUP-0034': [{ date: 'Sep 1, 2024', status: 'Registration received', source: 'VendorVerify' }, { date: 'Sep 2, 2024', status: 'Company information verified', source: 'VendorVerify' }, { date: 'Sep 3, 2024', status: 'Document collection started', source: 'VendorVerify' }],
  'SUP-0089': [{ date: 'Sep 6, 2024', status: 'Registration received', source: 'TrustDocs' }, { date: 'Sep 8, 2024', status: 'Registration review started', source: 'TrustDocs' }],
  'SUP-0156': [{ date: 'Aug 26, 2024', status: 'Requalification requested', source: 'VendorVerify' }, { date: 'Aug 30, 2024', status: 'Documents verified', source: 'VendorVerify' }, { date: 'Sep 6, 2024', status: 'Insurance evidence rejected', source: 'VendorVerify' }],
  'SUP-0177': [{ date: 'Aug 20, 2024', status: 'Registration received', source: 'TrustDocs' }, { date: 'Aug 27, 2024', status: 'Document review completed', source: 'TrustDocs' }, { date: 'Sep 4, 2024', status: 'Internal approval review started', source: 'TrustDocs' }],
  'SUP-0184': [{ date: 'Aug 18, 2024', status: 'Registration received', source: 'VendorVerify' }, { date: 'Aug 24, 2024', status: 'Required documents verified', source: 'VendorVerify' }, { date: 'Sep 8, 2024', status: 'Approval submitted', source: 'VendorVerify' }],
};

function sampleOverview(samples: SampleRequest[]): { label: string; tone: Tone; detail: string } {
  if (!samples.length) return { label: 'Not required', tone: 'neutral', detail: 'No sample requested' };
  const active = samples.find(isSampleOpen);
  if (active) return { label: active.status, tone: sampleStatusTone[active.status], detail: `${active.id} · ${active.product}` };
  const rejected = samples.filter(sample => sample.status === 'Rejected').length;
  return { label: rejected ? 'Decision made' : 'Approved', tone: rejected ? 'warning' : 'success', detail: `${samples.length - rejected} approved · ${rejected} rejected` };
}

function documentBadge(status: DocumentStatus) {
  if (status === 'Verified') return <StatusBadge status="Approved" small />;
  if (status === 'Rejected') return <StatusBadge status="Rejected" small />;
  if (status === 'Under review') return <StatusBadge status="In Progress" small />;
  return <StatusBadge status="Pending" small />;
}

function SyncIndicator({ status }: { status: OnboardingCompany['syncStatus'] }) {
  return <span aria-hidden="true" className={cx('h-1.5 w-1.5 shrink-0 rounded-full', status === 'Synced' ? toneFill.success : toneFill.warning)} />;
}

export default function Onboarding() {
  const [selected, setSelected] = useState<OnboardingCompany | null>(null);
  const [search, setSearch] = useState('');
  const [stepFilter, setStepFilter] = useState('All stages');

  const filtered = companies.filter(company =>
    (company.name.toLowerCase().includes(search.toLowerCase()) || company.id.toLowerCase().includes(search.toLowerCase())) &&
    (stepFilter === 'All stages' || company.step === stepFilter)
  );

  if (selected) {
    const requiredDocuments = selected.documents.filter(document => document.required);
    const verified = requiredDocuments.filter(document => document.status === 'Verified').length;
    const missing = requiredDocuments.filter(document => document.status === 'Missing');
    const attention = requiredDocuments.filter(document => document.status === 'Rejected');
    const activeStep = stepNames.indexOf(selected.step);
    const samples = sampleRequests[selected.id] ?? [];
    const summary: { label: string; value: string; note: string; tone: Tone }[] = [
      { label: 'Onboarding progress', value: `${selected.progress}%`, note: `${selected.days} days in onboarding`, tone: 'brand' },
      { label: 'Required documents', value: `${verified}/${requiredDocuments.length}`, note: 'Verified by third party', tone: 'success' },
      { label: 'Missing documents', value: `${missing.length}`, note: missing.length ? 'Waiting for supplier' : 'Nothing missing', tone: missing.length ? 'danger' : 'success' },
      { label: 'Needs attention', value: `${attention.length}`, note: attention.length ? 'Rejected by verifier' : 'No rejected documents', tone: attention.length ? 'warning' : 'neutral' },
      { label: 'Sample requests', value: `${samples.length}`, note: samples.length ? `${samples.filter(isSampleOpen).length} in progress · ${samples.filter(sample => !isSampleOpen(sample)).length} decided` : 'None requested', tone: 'neutral' },
    ];

    return (
      <Page>
        <Header breadcrumb={['Supplier Onboarding', 'Companies', selected.id]} title={selected.name} />
        <PageContent>
          <BackLink onClick={() => setSelected(null)}>Back to onboarding companies</BackLink>

          <Card padded>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar initials={selected.name[0]} size="lg" shape="square" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-ink">{selected.name}</div>
                    <StatusBadge status="In Progress" small />
                  </div>
                  <div className="mt-1 text-caption text-ink-muted">{selected.id} · {selected.category} · {selected.country} · {selected.requestType} · Owner {selected.owner}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="sm:text-right">
                  <div className="flex items-center gap-1.5 sm:justify-end">
                    <SyncIndicator status={selected.syncStatus} />
                    <span className="text-caption font-medium text-ink-soft">{selected.syncStatus}</span>
                  </div>
                  <div className="mt-1 text-caption text-ink-muted">{selected.source} · {selected.lastSync}</div>
                </div>
              </div>
            </div>

            <Stepper
              steps={stepNames.map((step, index) => ({
                label: step,
                caption: index < activeStep ? 'Completed' : index === activeStep ? 'In progress' : 'Pending',
                state: index < activeStep ? 'done' : index === activeStep ? 'active' : 'todo',
              }))}
            />
          </Card>

          <Card>
            <CardHeader title="Onboarding status history" />
            <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {(statusHistory[selected.id] || []).map((event, index) => (
                <div key={`${event.date}-${index}`} className="border-l-2 border-brand-200 pl-3">
                  <div className="text-caption text-ink-muted">{event.date} · {event.source}</div>
                  <div className="mt-1 text-body font-medium text-ink">{event.status}</div>
                </div>
              ))}
              {!statusHistory[selected.id]?.length && <div className="text-caption text-ink-muted">No status history received from source.</div>}
            </CardBody>
          </Card>

          <KpiGrid cols={5}>
            {summary.map(card => <KpiCard key={card.label} label={card.label} value={card.value} note={card.note} tone={card.tone} />)}
          </KpiGrid>

          <Grid cols="split3">
            <Card className="overflow-hidden xl:col-span-2">
              <CardHeader
                title="Document verification status"
                description={`Verification results are provided by ${selected.source}. SLM displays the latest API data.`}
                actions={<span className="text-caption text-ink-muted">{verified} of {requiredDocuments.length} required verified</span>}
              />
              <TableContainer>
                <Table minWidth={640}>
                  <HeadRow columns={['Document', 'Requirement', 'Verification', 'Updated', 'Source result']} />
                  <tbody>
                    {selected.documents.map(document => (
                      <Tr key={document.name}>
                        <Td className="font-medium text-ink">{document.name}</Td>
                        <Td><span className={cx('text-caption', document.required ? 'font-medium text-ink-soft' : 'text-ink-muted')}>{document.required ? 'Required' : 'Optional'}</span></Td>
                        <Td>{documentBadge(document.status)}</Td>
                        <Td className="text-ink-muted">{document.updated}</Td>
                        <Td className="text-ink-muted">{document.note}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader title="What's still needed" description="Items blocking the next onboarding stage" />
                <CardBody>
                  {missing.length === 0 && attention.length === 0 ? (
                    <Callout tone="success">All required documents have been received and verified.</Callout>
                  ) : (
                    <div className="space-y-2">
                      {[...missing, ...attention].map(document => (
                        <div key={document.name} className={cx('rounded-control border p-3', document.status === 'Rejected' ? 'border-danger-200 bg-danger-50' : 'border-warning-200 bg-warning-50')}>
                          <div className="text-body font-medium text-ink">{document.name}</div>
                          <div className={cx('mt-1 text-caption', document.status === 'Rejected' ? 'text-danger-700' : 'text-warning-700')}>{document.status === 'Rejected' ? document.note : 'Supplier has not submitted this document'}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>

              <Callout tone="info" title="System responsibility">
                Document verification is completed in <span className="font-semibold">{selected.source}</span>. SLM receives statuses through API and highlights missing or rejected requirements for onboarding follow-up.
                <div className="mt-3 border-t border-info-200 pt-3">
                  <span className="text-caption text-ink-muted">Last sync: {selected.lastSync}</span>
                </div>
              </Callout>
            </div>
          </Grid>

          <Card className="overflow-hidden">
            <CardHeader
              title="Sample requests"
              description="Physical samples requested for this supplier. The same list continues in Supplier profile → Compliance after activation."
            />
            <SampleRequests key={selected.id} samples={samples} />
          </Card>
        </PageContent>
      </Page>
    );
  }

  return (
    <Page>
      <Header breadcrumb={['Supplier Lifecycle']} title="Supplier Onboarding" action={{ label: '+ New Onboarding' }} />
      <PageContent>
        <KpiGrid cols={4}>
          <KpiCard label="In onboarding" value="47" note="5 updated today" tone="brand" />
          <KpiCard label="Missing documents" value="19" note="Across 11 companies" tone="danger" />
          <KpiCard label="Third-party review" value="14" note="Awaiting verification" tone="warning" />
          <KpiCard label="Completed this month" value="12" note="Average 18 days" tone="success" />
        </KpiGrid>

        <Card className="overflow-hidden">
          <CardHeader
            title="Companies in onboarding"
            description="Third-party verification data and outstanding onboarding requirements"
            actions={
              <Toolbar>
                <SearchInput value={search} onChange={event => setSearch(event.target.value)} className="w-full sm:w-64" placeholder="Search company or supplier ID..." />
                <Select aria-label="Filter by stage" value={stepFilter} onChange={event => setStepFilter(event.target.value)}>
                  <option>All stages</option>
                  {stepNames.slice(0, -1).map(step => <option key={step}>{step}</option>)}
                </Select>
                <Button size="md">Refresh all API data</Button>
              </Toolbar>
            }
          />

          <TableContainer>
            <Table minWidth={1180}>
              <HeadRow columns={['Company', 'Request type', 'Current stage', 'Progress', 'Documents', 'Sample request', 'Data source', 'Owner', 'Days', '']} />
              <tbody>
                {filtered.map(company => {
                  const required = company.documents.filter(document => document.required);
                  const verified = required.filter(document => document.status === 'Verified').length;
                  const missing = required.filter(document => document.status === 'Missing' || document.status === 'Rejected').length;
                  const sample = sampleOverview(sampleRequests[company.id] ?? []);
                  return (
                    <Tr key={company.id} onClick={() => setSelected(company)}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <Avatar initials={company.name[0]} shape="square" />
                          <div><CellStack primary={company.name} secondary={`${company.id} · ${company.category} · ${company.country}`} /></div>
                        </div>
                      </Td>
                      <Td>{company.requestType}</Td>
                      <Td><Badge tone="brand" small>{company.step}</Badge></Td>
                      <Td>
                        <div className="flex items-center gap-2"><ProgressBar value={company.progress} label={`${company.name} onboarding progress`} className="w-20" /><span className="text-caption tabular-nums text-ink-soft">{company.progress}%</span></div>
                      </Td>
                      <Td>
                        <div className="text-caption font-medium text-ink-soft">{verified}/{required.length} verified</div>
                        <div className={cx('mt-0.5 text-caption', missing ? 'text-danger-700' : 'text-success-700')}>{missing ? `${missing} missing or rejected` : 'Complete'}</div>
                      </Td>
                      <Td>
                        <Badge tone={sample.tone} small>{sample.label}</Badge>
                        <div className="mt-0.5 max-w-52 truncate text-caption text-ink-muted" title={sample.detail}>{sample.detail}</div>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1.5"><SyncIndicator status={company.syncStatus} /><span className="text-caption text-ink-soft">{company.source}</span></div>
                        <div className="mt-0.5 text-caption text-ink-muted">{company.lastSync}</div>
                      </Td>
                      <Td>{company.owner}</Td>
                      <Td className="text-ink-muted">{company.days}d</Td>
                      <Td><Button variant="link" className="whitespace-nowrap" onClick={() => setSelected(company)}>View details <ArrowRightIcon className="h-3.5 w-3.5" /></Button></Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </TableContainer>
          {filtered.length === 0 && <EmptyState title="No onboarding companies match these filters." description="Adjust the search or stage filter to see more results." />}
        </Card>
      </PageContent>
    </Page>
  );
}
