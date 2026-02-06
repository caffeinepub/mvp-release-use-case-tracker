import { UseCasePriority, UseCaseStatus, UseCaseValue, UseCaseEffort, ReleaseStatus, PhaseStatus } from '../backend';

export function getPriorityLabel(priority: UseCasePriority): string {
  const labels: Record<UseCasePriority, string> = {
    [UseCasePriority.p0]: 'P0',
    [UseCasePriority.p1]: 'P1',
    [UseCasePriority.p2]: 'P2',
    [UseCasePriority.p3]: 'P3',
  };
  return labels[priority];
}

export function getStatusLabel(status: UseCaseStatus): string {
  const labels: Record<UseCaseStatus, string> = {
    [UseCaseStatus.proposed]: 'Proposed',
    [UseCaseStatus.approved]: 'Approved',
    [UseCaseStatus.inBuild]: 'In Build',
    [UseCaseStatus.test]: 'Test',
    [UseCaseStatus.done]: 'Done',
    [UseCaseStatus.deferred]: 'Deferred',
  };
  return labels[status];
}

export function getValueLabel(value: UseCaseValue): string {
  const labels: Record<UseCaseValue, string> = {
    [UseCaseValue.high]: 'High',
    [UseCaseValue.med]: 'Med',
    [UseCaseValue.low]: 'Low',
  };
  return labels[value];
}

export function getEffortLabel(effort: UseCaseEffort): string {
  const labels: Record<UseCaseEffort, string> = {
    [UseCaseEffort.s]: 'S',
    [UseCaseEffort.m]: 'M',
    [UseCaseEffort.l]: 'L',
  };
  return labels[effort];
}

export function getReleaseStatusLabel(status: ReleaseStatus): string {
  const labels: Record<ReleaseStatus, string> = {
    [ReleaseStatus.planned]: 'Planned',
    [ReleaseStatus.inProgress]: 'In Progress',
    [ReleaseStatus.released]: 'Released',
  };
  return labels[status];
}

export function getPhaseStatusLabel(status: PhaseStatus): string {
  const labels: Record<PhaseStatus, string> = {
    [PhaseStatus.planned]: 'Planned',
    [PhaseStatus.inProgress]: 'In Progress',
    [PhaseStatus.completed]: 'Completed',
  };
  return labels[status];
}
