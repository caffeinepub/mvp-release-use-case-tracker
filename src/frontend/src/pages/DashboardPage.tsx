import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetAllUseCases, useGetAllReleases, useGetAllPhases } from '../hooks/useQueries';
import { UseCaseStatus, ReleaseStatus, PhaseStatus } from '../backend';
import { BarChart3, FolderKanban, CheckCircle2, Clock, Layers } from 'lucide-react';

export default function DashboardPage() {
  const { data: useCases = [] } = useGetAllUseCases();
  const { data: releases = [] } = useGetAllReleases();
  const { data: phases = [] } = useGetAllPhases();

  const stats = useMemo(() => {
    const statusCounts = {
      [UseCaseStatus.proposed]: 0,
      [UseCaseStatus.approved]: 0,
      [UseCaseStatus.inBuild]: 0,
      [UseCaseStatus.test]: 0,
      [UseCaseStatus.done]: 0,
      [UseCaseStatus.deferred]: 0,
    };

    useCases.forEach((uc) => {
      statusCounts[uc.status]++;
    });

    const phaseCounts: Record<string, number> = {};
    useCases.forEach((uc) => {
      phaseCounts[uc.phaseId] = (phaseCounts[uc.phaseId] || 0) + 1;
    });

    const releaseCounts: Record<string, number> = {};
    useCases.forEach((uc) => {
      releaseCounts[uc.mvpReleaseId] = (releaseCounts[uc.mvpReleaseId] || 0) + 1;
    });

    const phaseStatusCounts = {
      [PhaseStatus.planned]: 0,
      [PhaseStatus.inProgress]: 0,
      [PhaseStatus.completed]: 0,
    };

    phases.forEach((p) => {
      phaseStatusCounts[p.status]++;
    });

    const releaseStatusCounts = {
      [ReleaseStatus.planned]: 0,
      [ReleaseStatus.inProgress]: 0,
      [ReleaseStatus.released]: 0,
    };

    releases.forEach((r) => {
      releaseStatusCounts[r.status]++;
    });

    return { statusCounts, phaseCounts, releaseCounts, phaseStatusCounts, releaseStatusCounts };
  }, [useCases, releases, phases]);

  const statusLabels: Record<UseCaseStatus, string> = {
    [UseCaseStatus.proposed]: 'Proposed',
    [UseCaseStatus.approved]: 'Approved',
    [UseCaseStatus.inBuild]: 'In Build',
    [UseCaseStatus.test]: 'Test',
    [UseCaseStatus.done]: 'Done',
    [UseCaseStatus.deferred]: 'Deferred',
  };

  const phaseStatusLabels: Record<PhaseStatus, string> = {
    [PhaseStatus.planned]: 'Planned',
    [PhaseStatus.inProgress]: 'In Progress',
    [PhaseStatus.completed]: 'Completed',
  };

  const releaseStatusLabels: Record<ReleaseStatus, string> = {
    [ReleaseStatus.planned]: 'Planned',
    [ReleaseStatus.inProgress]: 'In Progress',
    [ReleaseStatus.released]: 'Released',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold">Dashboard</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{useCases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Phases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{phases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Releases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{releases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div className="text-3xl font-bold">{stats.statusCounts[UseCaseStatus.done]}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Use Cases by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Use Cases by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{statusLabels[status as UseCaseStatus]}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Use Cases by Phase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Use Cases by Phase
          </CardTitle>
        </CardHeader>
        <CardContent>
          {phases.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No phases created yet</p>
          ) : (
            <div className="space-y-3">
              {phases.map((phase) => (
                <div
                  key={phase.phaseId}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{phase.phaseName}</div>
                    <div className="text-sm text-muted-foreground">{phase.phaseId}</div>
                  </div>
                  <Badge variant="outline" className="text-base px-3">
                    {stats.phaseCounts[phase.phaseId] || 0} use cases
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Use Cases by Release */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Use Cases by Release
          </CardTitle>
        </CardHeader>
        <CardContent>
          {releases.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No releases created yet</p>
          ) : (
            <div className="space-y-3">
              {releases.map((release) => (
                <div
                  key={release.releaseId}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{release.releaseName}</div>
                    <div className="text-sm text-muted-foreground">{release.releaseId}</div>
                  </div>
                  <Badge variant="outline" className="text-base px-3">
                    {stats.releaseCounts[release.releaseId] || 0} use cases
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phases by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Phases by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(stats.phaseStatusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{phaseStatusLabels[status as PhaseStatus]}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Releases by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Releases by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(stats.releaseStatusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{releaseStatusLabels[status as ReleaseStatus]}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
