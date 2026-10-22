import { useState } from 'react';
import Header from '../components/Header';
import { Avatar, Badge, Button, Callout, Card, CardBody, CardHeader, Checkbox, EmptyState, Field, Grid, HeadRow, Input, Page, Select, Table, TableContainer, Td, Th, Tr, cx } from '../components/ui';

const sections = ['Users & Roles', 'Supplier Categories', 'Risk Config', 'KPI Config', 'Assessment Templates', 'Document Types', 'Monitoring & Alerts', 'Audit Logs', 'Data Visibility', 'System'];

const auditLogs = [
  { time: 'Oct 12, 2026 · 10:42', user: 'James Kim', action: 'Updated supplier risk threshold', record: 'Risk Config', result: 'Success' },
  { time: 'Oct 12, 2026 · 09:18', user: 'Sophie Chen', action: 'Opened supplier profile', record: 'SUP-0012', result: 'Viewed' },
  { time: 'Oct 11, 2026 · 16:34', user: 'Marcus Patel', action: 'Exported qualification report', record: 'Qualification', result: 'Success' },
  { time: 'Oct 11, 2026 · 14:02', user: 'Laura Torres', action: 'Changed user role', record: 'Anna Bauer', result: 'Success' },
];

const users = [
  { name: 'James Kim', email: 'j.kim@company.com', role: 'Procurement Manager', status: 'Active', lastLogin: 'Sep 10, 2024' },
  { name: 'Sophie Chen', email: 's.chen@company.com', role: 'Supplier Manager', status: 'Active', lastLogin: 'Sep 10, 2024' },
  { name: 'Marcus Patel', email: 'm.patel@company.com', role: 'Quality Analyst', status: 'Active', lastLogin: 'Sep 9, 2024' },
  { name: 'Laura Torres', email: 'l.torres@company.com', role: 'Risk Manager', status: 'Active', lastLogin: 'Sep 8, 2024' },
  { name: 'Robert Okafor', email: 'r.okafor@company.com', role: 'ESG Manager', status: 'Active', lastLogin: 'Sep 7, 2024' },
  { name: 'Anna Bauer', email: 'a.bauer@company.com', role: 'Read Only', status: 'Inactive', lastLogin: 'Aug 12, 2024' },
];

const roles = ['Admin', 'Procurement Manager', 'Supplier Manager', 'Quality Analyst', 'Risk Manager', 'ESG Manager', 'Read Only'];
const supplierCategories = [
  { category: 'Raw Materials', groups: 'Industrial Metals, Steel Products', owner: 'S. Chen', suppliers: 214 },
  { category: 'Electronics', groups: 'Electronic Components, Controls', owner: 'M. Patel', suppliers: 184 },
  { category: 'Packaging', groups: 'Industrial Packaging, Polymers', owner: 'L. Torres', suppliers: 241 },
  { category: 'Mechanical', groups: 'Fasteners, Bearings, Tooling', owner: 'S. Chen', suppliers: 198 },
];
const documentTypes = [
  { name: 'Certificate of Incorporation', requiredFor: 'All suppliers', expiry: 'No expiry', owner: 'Legal' },
  { name: 'ISO 9001 Certificate', requiredFor: 'Manufacturing', expiry: '90 days', owner: 'Quality' },
  { name: 'Public Liability Insurance', requiredFor: 'All active suppliers', expiry: '60 days', owner: 'Legal' },
  { name: 'ESG Policy Statement', requiredFor: 'Strategic / high-risk', expiry: '30 days', owner: 'ESG' },
];

export default function Administration() {
  const [section, setSection] = useState('Users & Roles');
  const [expiryThreshold, setExpiryThreshold] = useState(90);
  const [riskThreshold, setRiskThreshold] = useState(70);
  const [criticalThreshold, setCriticalThreshold] = useState(85);
  const [kpiWeights, setKpiWeights] = useState({ delivery: 30, quality: 30, cost: 15, service: 15, compliance: 10 });
  const [followedSupplier, setFollowedSupplier] = useState('SUP-0012');
  const [saved, setSaved] = useState(false);
  const totalWeight = Object.values(kpiWeights).reduce((total, value) => total + value, 0);

  return (
    <Page>
      <Header breadcrumb={['SLM Platform']} title="Administration" action={{ label: '+ Invite User' }} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        {/* Sub-nav */}
        <nav aria-label="Administration sections" className="no-scrollbar flex shrink-0 gap-1 overflow-x-auto border-b border-line bg-surface p-2 md:w-56 md:flex-col md:overflow-y-auto md:border-b-0 md:border-r md:p-3">
          {sections.map(s => (
            <button
              key={s}
              type="button"
              aria-current={section === s ? 'page' : undefined}
              onClick={() => setSection(s)}
              className={cx(
                'whitespace-nowrap rounded-control px-3 py-2 text-left text-body font-medium transition-colors',
                section === s ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-sunken hover:text-ink',
              )}
            >
              {s}
            </button>
          ))}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6">
          {section === 'Users & Roles' && (
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader title="Users" />
                <TableContainer>
                  <Table minWidth={760}>
                    <HeadRow columns={['Name', 'Email', 'Role', 'Status', 'Last Login', '']} />
                    <tbody>
                      {users.map((u, i) => (
                        <Tr key={i}>
                          <Td>
                            <div className="flex items-center gap-2.5">
                              <Avatar initials={u.name.split(' ').map(n => n[0]).join('')} size="sm" />
                              <span className="text-body font-medium text-ink">{u.name}</span>
                            </div>
                          </Td>
                          <Td className="text-ink-muted">{u.email}</Td>
                          <Td>
                            <Select size="sm" aria-label={`Role for ${u.name}`} defaultValue={u.role}>
                              {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </Select>
                          </Td>
                          <Td>
                            <Badge tone={u.status === 'Active' ? 'success' : 'neutral'} small dot>{u.status}</Badge>
                          </Td>
                          <Td className="whitespace-nowrap text-ink-muted">{u.lastLogin}</Td>
                          <Td>
                            <Button variant="link-muted">Edit</Button>
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </TableContainer>
              </Card>

              {/* Roles */}
              <Card>
                <CardHeader title="Roles & Permissions" />
                <CardBody>
                  <Grid cols={3}>
                    {roles.map(r => (
                      <div key={r} className="flex items-center justify-between rounded-control border border-line p-3">
                        <span className="text-body font-medium text-ink-soft">{r}</span>
                        <Button variant="link">Edit</Button>
                      </div>
                    ))}
                  </Grid>
                </CardBody>
              </Card>
            </div>
          )}

          {section === 'Monitoring & Alerts' && (
            <div className="max-w-3xl space-y-4">
              <Card>
                <CardHeader title="Monitoring configuration" description="Set portfolio alert thresholds and supplier-specific monitoring." />
                <CardBody>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Document expiry warning (days)"><Input type="number" min="1" max="365" value={expiryThreshold} onChange={event => { setExpiryThreshold(Number(event.target.value)); setSaved(false); }} /></Field>
                    <Field label="Risk escalation score"><Input type="number" min="1" max="100" value={riskThreshold} onChange={event => { setRiskThreshold(Number(event.target.value)); setSaved(false); }} /></Field>
                  </div>
                  <Field label="Follow a specific supplier" className="mt-5"><Input value={followedSupplier} onChange={event => { setFollowedSupplier(event.target.value); setSaved(false); }} placeholder="Supplier ID" /></Field>
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line-subtle pt-5"><Button variant="primary" size="md" onClick={() => setSaved(true)}>Save monitoring settings</Button>{saved && <span role="status" className="text-caption font-medium text-success-700">Settings saved for this session</span>}</div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Escalation rules" />
                <CardBody className="text-body text-ink-soft"><div className="flex justify-between gap-4 border-b border-line-subtle py-2.5 first:pt-0"><span>Document renewal reminders</span><span className="font-medium text-ink">90 / 60 / 30 days</span></div><div className="flex justify-between gap-4 border-b border-line-subtle py-2.5"><span>High-risk score escalation</span><span className="font-medium text-ink">Score ≥ {riskThreshold}</span></div><div className="flex justify-between gap-4 py-2.5 pb-0"><span>Supplier-specific monitoring</span><span className="font-medium text-ink">{followedSupplier || 'Not configured'}</span></div></CardBody>
              </Card>
            </div>
          )}

          {section === 'Audit Logs' && (
            <Card className="overflow-hidden">
              <CardHeader title="User activity logs" description="Administrative and supplier-record events" />
              <TableContainer><Table minWidth={700}><HeadRow columns={['Timestamp', 'User', 'Action', 'Record', 'Result']} /><tbody>{auditLogs.map((entry, index) => <Tr key={`${entry.time}-${index}`}><Td className="whitespace-nowrap text-ink-muted">{entry.time}</Td><Td className="font-medium text-ink">{entry.user}</Td><Td>{entry.action}</Td><Td className="font-mono text-caption text-brand-700">{entry.record}</Td><Td><Badge tone={entry.result === 'Success' ? 'success' : 'neutral'} small>{entry.result}</Badge></Td></Tr>)}</tbody></Table></TableContainer>
            </Card>
          )}

          {section === 'Data Visibility' && (
            <Card className="max-w-3xl overflow-hidden">
              <CardHeader title="Role-based data visibility" description="Configure which supplier data domains each role can access." />
              <TableContainer><Table minWidth={600}><thead><tr><Th>Role</Th>{['Supplier master', 'Risk', 'Commercial terms', 'Admin settings'].map(label => <Th key={label} align="center">{label}</Th>)}</tr></thead><tbody>{roles.slice(0, 5).map(role => <Tr key={role}><Td className="font-medium text-ink">{role}</Td>{['Supplier master', 'Risk', 'Commercial terms', 'Admin settings'].map((domain, index) => <Td key={domain} className="text-center"><Checkbox aria-label={`${role}: ${domain}`} defaultChecked={index < (role === 'Read Only' ? 2 : role === 'Quality Analyst' ? 3 : 4)} /></Td>)}</Tr>)}</tbody></Table></TableContainer>
            </Card>
          )}

          {section === 'Supplier Categories' && (
            <Card className="overflow-hidden"><CardHeader title="Supplier category and material groups" description="Category ownership and supplier coverage" /><TableContainer><Table minWidth={640}><HeadRow columns={['Category', 'Material groups', 'Category owner', 'Suppliers', '']} /><tbody>{supplierCategories.map(item => <Tr key={item.category}><Td className="font-medium text-ink">{item.category}</Td><Td>{item.groups}</Td><Td>{item.owner}</Td><Td className="tabular-nums">{item.suppliers}</Td><Td><Button variant="link">Edit</Button></Td></Tr>)}</tbody></Table></TableContainer></Card>
          )}

          {section === 'Risk Config' && (
            <Card className="max-w-2xl"><CardHeader title="Risk classification thresholds" /><CardBody><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{[['High risk escalation', riskThreshold, setRiskThreshold], ['Critical risk', criticalThreshold, setCriticalThreshold]].map(([label, value, setter]) => <Field key={label as string} label={label as string}><Input type="number" min="1" max="100" value={value as number} onChange={event => (setter as (value: number) => void)(Number(event.target.value))} /></Field>)}</div><Callout tone="warning" compact className="mt-4">Critical ≥ {criticalThreshold}; High ≥ {riskThreshold}; lower thresholds are evaluated by the connected risk source.</Callout><div className="mt-5 flex flex-wrap items-center gap-3"><Button variant="primary" size="md" onClick={() => setSaved(true)}>Save risk configuration</Button>{saved && <span className="text-caption font-medium text-success-700">Saved for this session</span>}</div></CardBody></Card>
          )}

          {section === 'KPI Config' && (
            <Card className="max-w-2xl"><CardHeader title="Supplier scorecard weights" description="Weights contribute to the portfolio performance score." /><CardBody><div className="space-y-4">{Object.entries(kpiWeights).map(([name, value]) => <label key={name} className="grid grid-cols-[1fr_6rem_3rem] items-center gap-3 text-body capitalize text-ink-soft sm:grid-cols-[1fr_8rem_3rem]">{name}<input type="range" min="0" max="100" value={value} onChange={event => setKpiWeights(current => ({ ...current, [name]: Number(event.target.value) }))} className="accent-brand-600" /><span className="text-right font-medium tabular-nums text-ink">{value}%</span></label>)}</div><div className="mt-5 border-t border-line-subtle pt-4 text-caption text-ink-muted">Total weight: <span className={cx('font-semibold', totalWeight === 100 ? 'text-success-700' : 'text-warning-700')}>{totalWeight}%</span></div></CardBody></Card>
          )}

          {section === 'Assessment Templates' && (
            <Grid cols={2}>{[['Supplier Qualification', 'Financial, quality, delivery, ESG', 'Annual / risk-triggered'], ['High-Risk Due Diligence', 'Financial, cyber, ESG, continuity', 'At onboarding / risk escalation'], ['Supplier Quality Audit', 'Process control, traceability, CAPA', 'Scheduled / issue-triggered'], ['Performance Review', 'Delivery, quality, service, cost', 'Quarterly']].map(([name, criteria, cadence]) => <Card key={name} padded><div className="text-sm font-semibold text-ink">{name}</div><div className="mt-3 text-body text-ink-soft">{criteria}</div><div className="mt-2 text-caption text-ink-muted">{cadence}</div><Button variant="link" className="mt-4">Edit template</Button></Card>)}</Grid>
          )}

          {section === 'Document Types' && (
            <Card className="overflow-hidden"><CardHeader title="Document requirements" description="Requirements by supplier scope and renewal cadence" /><TableContainer><Table minWidth={640}><HeadRow columns={['Document type', 'Required for', 'Renewal warning', 'Owner', '']} /><tbody>{documentTypes.map(item => <Tr key={item.name}><Td className="font-medium text-ink">{item.name}</Td><Td>{item.requiredFor}</Td><Td>{item.expiry}</Td><Td>{item.owner}</Td><Td><Button variant="link">Edit</Button></Td></Tr>)}</tbody></Table></TableContainer></Card>
          )}

          {section === 'Notifications' && (
            <Card className="max-w-2xl"><CardHeader title="Notification rules" /><CardBody><div className="space-y-3">{['Document expiry at 90 / 60 / 30 days', 'Supplier risk score crosses escalation threshold', 'Qualification requalification is due', 'Corrective action becomes overdue', 'Integration source has not synchronized'].map(rule => <label key={rule} className="flex items-center gap-3 border-b border-line-subtle pb-3 text-body text-ink-soft"><Checkbox defaultChecked />{rule}</label>)}</div><div className="mt-4 flex flex-wrap items-center gap-3"><label htmlFor="admin-follow-up-channel" className="text-body text-ink-soft">Default follow-up channel</label><Select id="admin-follow-up-channel"><option>In-app and email</option><option>In-app only</option><option>Email only</option></Select></div></CardBody></Card>
          )}

          {section === 'System' && (
            <div className="max-w-2xl space-y-4"><Card><CardHeader title="System settings" /><CardBody><div className="space-y-3 text-body">{[['Supplier master source', 'ERP / Supplier Information Management'], ['Risk source', 'Third-party risk provider'], ['Document verification', 'Connected certification providers'], ['Supplier portal', 'Enabled'], ['Data refresh', 'On source event / scheduled sync']].map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-line-subtle pb-3"><span className="text-ink-muted">{label}</span><span className="text-right font-medium text-ink">{value}</span></div>)}</div><Button variant="link" className="mt-4" onClick={() => setSection('Monitoring & Alerts')}>Configure monitoring →</Button></CardBody></Card></div>
          )}

          {!['Users & Roles', 'Supplier Categories', 'Risk Config', 'KPI Config', 'Assessment Templates', 'Document Types', 'Monitoring & Alerts', 'Audit Logs', 'Data Visibility', 'Notifications', 'System'].includes(section) && (
            <Card>
              <EmptyState title={`${section} Configuration`} description={`Settings and configuration for ${section}`} />
            </Card>
          )}
          </div>
        </div>
      </div>
    </Page>
  );
}
