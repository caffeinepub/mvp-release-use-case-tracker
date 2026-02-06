import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Phase, Release } from '../backend';
import { getPhaseStatusLabel } from '../lib/labels';

interface PhaseTableProps {
  phases: Phase[];
  releases: Release[];
  onSelectPhase: (phase: Phase) => void;
  isLoading: boolean;
}

export default function PhaseTable({
  phases,
  releases,
  onSelectPhase,
  isLoading,
}: PhaseTableProps) {
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

  if (phases.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No phases found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-32">Phase ID</TableHead>
            <TableHead className="min-w-[200px]">Phase Name</TableHead>
            <TableHead className="min-w-[300px]">Phase Goal</TableHead>
            <TableHead className="w-40">Target Date</TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-40">Release</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {phases.map((phase) => (
            <TableRow
              key={phase.phaseId}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectPhase(phase)}
            >
              <TableCell className="font-mono text-xs">{phase.phaseId}</TableCell>
              <TableCell className="font-medium">{phase.phaseName}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{phase.phaseGoal}</TableCell>
              <TableCell className="text-sm">{phase.targetDate || '-'}</TableCell>
              <TableCell>
                <Badge>{getPhaseStatusLabel(phase.status)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getReleaseNameById(phase.releaseId)}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
