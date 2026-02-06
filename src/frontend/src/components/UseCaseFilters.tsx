import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Phase, Release, UseCase, UseCasePriority, UseCaseStatus } from '../backend';
import { getPriorityLabel, getStatusLabel } from '../lib/labels';

interface UseCaseFiltersProps {
  filters: {
    phase: string | null;
    release: string | null;
    status: UseCaseStatus | null;
    priority: UseCasePriority | null;
    owner: string | null;
  };
  onFiltersChange: (filters: any) => void;
  phases: Phase[];
  releases: Release[];
  useCases: UseCase[];
}

export default function UseCaseFilters({ filters, onFiltersChange, phases, releases, useCases }: UseCaseFiltersProps) {
  const priorities = [UseCasePriority.p0, UseCasePriority.p1, UseCasePriority.p2, UseCasePriority.p3];
  const statuses = [UseCaseStatus.proposed, UseCaseStatus.approved, UseCaseStatus.inBuild, UseCaseStatus.test, UseCaseStatus.done, UseCaseStatus.deferred];

  const uniqueOwners = Array.from(new Set(useCases.map((uc) => uc.owner).filter(Boolean)));

  const hasActiveFilters = filters.phase || filters.release || filters.status || filters.priority || filters.owner;

  const clearFilters = () => {
    onFiltersChange({
      phase: null,
      release: null,
      status: null,
      priority: null,
      owner: null,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Phase</Label>
          <Select
            value={filters.phase || 'all'}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, phase: value === 'all' ? null : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All phases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All phases</SelectItem>
              {phases.map((p) => (
                <SelectItem key={p.phaseId} value={p.phaseId}>
                  {p.phaseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Release</Label>
          <Select
            value={filters.release || 'all'}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, release: value === 'all' ? null : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All releases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All releases</SelectItem>
              {releases.map((r) => (
                <SelectItem key={r.releaseId} value={r.releaseId}>
                  {r.releaseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Status</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value === 'all' ? null : (value as UseCaseStatus) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {getStatusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Priority</Label>
          <Select
            value={filters.priority || 'all'}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, priority: value === 'all' ? null : (value as UseCasePriority) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {priorities.map((p) => (
                <SelectItem key={p} value={p}>
                  {getPriorityLabel(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Owner</Label>
          <Input
            placeholder="Filter by owner..."
            value={filters.owner || ''}
            onChange={(e) => onFiltersChange({ ...filters, owner: e.target.value || null })}
          />
        </div>
      </div>
    </div>
  );
}
