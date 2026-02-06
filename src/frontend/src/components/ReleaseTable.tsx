import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Release } from '../backend';
import { getReleaseStatusLabel } from '../lib/labels';

interface ReleaseTableProps {
  releases: Release[];
  onSelectRelease: (release: Release) => void;
  isLoading: boolean;
}

export default function ReleaseTable({
  releases,
  onSelectRelease,
  isLoading,
}: ReleaseTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (releases.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No releases found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-32">Release ID</TableHead>
            <TableHead className="min-w-[200px]">Name</TableHead>
            <TableHead className="min-w-[300px]">Goal</TableHead>
            <TableHead className="w-40">Target Date</TableHead>
            <TableHead className="w-32">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {releases.map((release) => (
            <TableRow
              key={release.releaseId}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectRelease(release)}
            >
              <TableCell className="font-mono text-xs">{release.releaseId}</TableCell>
              <TableCell className="font-medium">{release.releaseName}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{release.releaseGoal}</TableCell>
              <TableCell className="text-sm">{release.targetDate || '-'}</TableCell>
              <TableCell>
                <Badge>{getReleaseStatusLabel(release.status)}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
