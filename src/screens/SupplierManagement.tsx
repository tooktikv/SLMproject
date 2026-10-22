import { useState } from 'react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { Supplier, suppliers } from '../data/suppliers';
import { useNavigation } from '../NavigationContext';
import { Badge, Button, Card, CellStack, Checkbox, EmptyState, HeadRow, Page, PageContent, Pagination, ProgressBar, SearchInput, Select, Table, TableContainer, Td, Th, Toolbar, Tr, type Tone } from '../components/ui';

const riskTone: Record<string, Tone> = {
  'Critical': 'danger',
  'High Risk': 'danger',
  'Medium Risk': 'warning',
  'Low Risk': 'success',
};

function PerfBar({ value }: { value: number }) {
  if (!value) return <span className="text-caption text-ink-muted">N/A</span>;
  const tone: Tone = value >= 80 ? 'success' : value >= 65 ? 'warning' : 'danger';
  return (
    <div className="flex items-center gap-2">
      <ProgressBar value={value} tone={tone} label="Performance" className="w-16" />
      <span className="text-caption tabular-nums text-ink-soft">{value}%</span>
    </div>
  );
}

export default function SupplierManagement({ onOpenSupplier }: { onOpenSupplier: (supplier: Supplier) => void }) {
  const { navigate } = useNavigation();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = suppliers.filter(s =>
    (`${s.name} ${s.id} ${s.taxId || ''}`.toLowerCase().includes(search.toLowerCase())) &&
    (riskFilter === 'All' || s.risk === riskFilter) &&
    (categoryFilter === 'All Categories' || s.category === categoryFilter) &&
    (statusFilter === 'All Statuses' || s.status === statusFilter)
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleSuppliers = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleAll = () => setSelected(visibleSuppliers.every(supplier => selected.includes(supplier.id)) ? [] : visibleSuppliers.map(supplier => supplier.id));
  const resetFilters = () => {
    setSearch('');
    setRiskFilter('All');
    setCategoryFilter('All Categories');
    setStatusFilter('All Statuses');
    setPage(1);
  };

  return (
    <Page>
      <Header breadcrumb={['Supplier lifecycle']} title="Supplier Management" action={{ label: '+ Add Supplier', onClick: () => navigate('onboarding') }} />
      <PageContent>

        {/* Filters */}
        <Card className="p-3">
          <Toolbar className="gap-3">
            <SearchInput
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="min-w-48 flex-1"
              placeholder="Search suppliers..."
            />
            <Select aria-label="Category" value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}>
              {['All Categories', 'Raw Materials', 'Electronics', 'Packaging', 'Mechanical', 'IT Services', 'Logistics'].map(item => <option key={item}>{item}</option>)}
            </Select>
            <Select aria-label="Risk" value={riskFilter} onChange={e => { setRiskFilter(e.target.value); setPage(1); }}>
              {['All', 'Critical', 'High Risk', 'Medium Risk', 'Low Risk'].map(item => <option key={item}>{item}</option>)}
            </Select>
            <Select aria-label="Status" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
              {['All Statuses', 'Active', 'Pending', 'Draft', 'Rejected'].map(item => <option key={item}>{item}</option>)}
            </Select>
            <Button size="md" onClick={resetFilters}>Reset</Button>
            <div className="text-caption text-ink-muted lg:ml-auto" aria-live="polite">{filtered.length} of {suppliers.length} suppliers</div>
          </Toolbar>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 border-b border-brand-100 bg-brand-50 px-4 py-2.5">
              <span className="text-body font-medium text-brand-700">{selected.length} selected</span>
              <Button variant="link">Export</Button>
              <Button variant="link">Assign Owner</Button>
              <Button variant="link-danger">Deactivate</Button>
            </div>
          )}
          <TableContainer>
            <Table minWidth={900}>
              <HeadRow
                leading={
                  <Th className="w-10">
                    <Checkbox checked={visibleSuppliers.length > 0 && visibleSuppliers.every(supplier => selected.includes(supplier.id))} onChange={toggleAll} aria-label="Select visible suppliers" />
                  </Th>
                }
                columns={['Supplier', 'Category / Products', 'Status', 'Risk', 'Performance', 'Qualification', 'Owner', 'Last Updated', '']}
              />
              <tbody>
                {visibleSuppliers.map(s => (
                  <Tr key={s.id}>
                    <Td>
                      <Checkbox checked={selected.includes(s.id)} onChange={() => setSelected(p => p.includes(s.id) ? p.filter(id => id !== s.id) : [...p, s.id])} aria-label={`Select ${s.name}`} />
                    </Td>
                    <Td>
                      <button type="button" onClick={() => onOpenSupplier(s)} className="rounded-sm text-left">
                        <CellStack primary={s.name} secondary={s.id} mono tone="link" />
                      </button>
                    </Td>
                    <Td><CellStack primary={s.materialGroup || s.category} tone="plain" secondary={`${s.productTypes?.join(', ') || s.category} · ${s.country}`} /></Td>
                    <Td><StatusBadge status={s.status} small /></Td>
                    <Td><Badge tone={riskTone[s.risk] ?? 'neutral'} small>{s.risk}</Badge></Td>
                    <Td><PerfBar value={s.perf} /></Td>
                    <Td><StatusBadge status={s.qualificationStatus || s.qual} small /></Td>
                    <Td className="whitespace-nowrap">{s.owner}</Td>
                    <Td className="whitespace-nowrap text-ink-muted">{s.lastUpdated || s.lastReview}</Td>
                    <Td>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Button variant="link" onClick={() => onOpenSupplier(s)}>View profile</Button>
                        <span aria-hidden="true" className="text-line">|</span>
                        <Button variant="link-muted" onClick={() => onOpenSupplier(s)}>Edit</Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
          {filtered.length === 0 && (
            <EmptyState
              title="No suppliers match these filters"
              description="Try a different search term or clear the active filters."
              action={<Button onClick={resetFilters}>Reset filters</Button>}
            />
          )}
          {/* Pagination */}
          <Pagination
            summary={<>Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} suppliers</>}
            page={page}
            pageCount={pageCount}
            onPrevious={() => setPage(current => Math.max(1, current - 1))}
            onNext={() => setPage(current => Math.min(pageCount, current + 1))}
          />
        </Card>

      </PageContent>
    </Page>
  );
}
