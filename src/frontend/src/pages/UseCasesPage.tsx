import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Info } from 'lucide-react';
import { useGetAllUseCases, useGetAllReleases, useGetAllPhases } from '../hooks/useQueries';
import UseCaseTable from '../components/UseCaseTable';
import UseCaseDetailPanel from '../components/UseCaseDetailPanel';
import UseCaseFilters from '../components/UseCaseFilters';
import CreateUseCaseDialog from '../components/CreateUseCaseDialog';
import type { UseCase, UseCasePriority, UseCaseStatus } from '../backend';

export default function UseCasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState<{
    phase: string | null;
    release: string | null;
    status: UseCaseStatus | null;
    priority: UseCasePriority | null;
    owner: string | null;
  }>({
    phase: null,
    release: null,
    status: null,
    priority: null,
    owner: null,
  });

  const { data: useCases = [], isLoading } = useGetAllUseCases();
  const { data: releases = [] } = useGetAllReleases();
  const { data: phases = [] } = useGetAllPhases();

  const filteredUseCases = useMemo(() => {
    let filtered = [...useCases];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (uc) =>
          uc.title.toLowerCase().includes(query) ||
          uc.description.toLowerCase().includes(query) ||
          uc.tags.toLowerCase().includes(query) ||
          uc.owner.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.phase) {
      filtered = filtered.filter((uc) => uc.phaseId === filters.phase);
    }
    if (filters.release) {
      filtered = filtered.filter((uc) => uc.mvpReleaseId === filters.release);
    }
    if (filters.status) {
      filtered = filtered.filter((uc) => uc.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter((uc) => uc.priority === filters.priority);
    }
    if (filters.owner) {
      filtered = filtered.filter((uc) => uc.owner.toLowerCase().includes(filters.owner!.toLowerCase()));
    }

    return filtered;
  }, [useCases, searchQuery, filters]);

  // Find the selected phase to display its goal
  const selectedPhase = filters.phase ? phases.find((p) => p.phaseId === filters.phase) : null;
  const showPhaseNote = selectedPhase && selectedPhase.phaseGoal;

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      {showFilters && (
        <aside className="w-64 flex-shrink-0">
          <UseCaseFilters
            filters={filters}
            onFiltersChange={setFilters}
            phases={phases}
            releases={releases}
            useCases={useCases}
          />
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search use cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            disabled={releases.length === 0 || phases.length === 0}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Use Case
          </Button>
        </div>

        {/* Phase Information Note */}
        {showPhaseNote && (
          <div className="mb-6 bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">{selectedPhase.phaseName}</h4>
              <p className="text-sm text-muted-foreground">{selectedPhase.phaseGoal}</p>
            </div>
          </div>
        )}

        {(releases.length === 0 || phases.length === 0) && (
          <div className="bg-muted/50 border border-dashed rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {phases.length === 0 && releases.length === 0
                ? 'No phases or releases found. Please create a phase and release first before adding use cases.'
                : phases.length === 0
                ? 'No phases found. Please create a phase first before adding use cases.'
                : 'No releases found. Please create a release first before adding use cases.'}
            </p>
          </div>
        )}

        {/* Table */}
        <UseCaseTable
          useCases={filteredUseCases}
          phases={phases}
          releases={releases}
          onSelectUseCase={setSelectedUseCase}
          isLoading={isLoading}
        />
      </div>

      {/* Detail Panel */}
      {selectedUseCase && (
        <UseCaseDetailPanel
          useCase={selectedUseCase}
          phases={phases}
          releases={releases}
          onClose={() => setSelectedUseCase(null)}
        />
      )}

      {/* Create Dialog */}
      <CreateUseCaseDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        phases={phases}
        releases={releases}
      />
    </div>
  );
}
