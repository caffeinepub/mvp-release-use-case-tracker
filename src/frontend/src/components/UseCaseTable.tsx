import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { UseCase, Release, Phase } from '../backend';
import { formatTimestamp } from '../lib/utils';
import { getPriorityLabel, getStatusLabel, getValueLabel, getEffortLabel } from '../lib/labels';

interface UseCaseTableProps {
  useCases: UseCase[];
  phases: Phase[];
  releases: Release[];
  onSelectUseCase: (uc: UseCase) => void;
  isLoading: boolean;
}

export default function UseCaseTable({
  useCases,
  phases,
  releases,
  onSelectUseCase,
  isLoading,
}: UseCaseTableProps) {
  const getPhaseNameById = (id: string) => {
    const phase = phases.find((p) => p.phaseId === id);
    return phase?.phaseName || id;
  };

  const getReleaseNameById = (id: string) => {
    const release = releases.find((r) => r.releaseId === id);
    return release?.releaseName || id;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (useCases.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No use cases found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-24">ID</TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead className="w-32">Phase</TableHead>
            <TableHead className="w-32">Release</TableHead>
            <TableHead className="w-24">Priority</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-20">Effort</TableHead>
            <TableHead className="w-20">Value</TableHead>
            <TableHead className="w-32">Owner</TableHead>
            <TableHead className="w-32">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {useCases.map((uc) => (
            <TableRow
              key={uc.ucId}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectUseCase(uc)}
            >
              <TableCell className="font-mono text-xs">{uc.ucId}</TableCell>
              <TableCell className="font-medium">{uc.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{getPhaseNameById(uc.phaseId)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getReleaseNameById(uc.mvpReleaseId)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{getPriorityLabel(uc.priority)}</Badge>
              </TableCell>
              <TableCell>
                <Badge>{getStatusLabel(uc.status)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getEffortLabel(uc.effort)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getValueLabel(uc.value)}</Badge>
              </TableCell>
              <TableCell className="text-sm">{uc.owner || '-'}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatTimestamp(uc.lastUpdated)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
