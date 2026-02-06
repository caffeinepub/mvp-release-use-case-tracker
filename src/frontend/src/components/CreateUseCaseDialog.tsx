import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateUseCase } from '../hooks/useQueries';
import type { Phase, Release } from '../backend';
import { UseCasePriority, UseCaseStatus, UseCaseValue, UseCaseEffort } from '../backend';
import { getPriorityLabel, getStatusLabel, getValueLabel, getEffortLabel } from '../lib/labels';

interface CreateUseCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phases: Phase[];
  releases: Release[];
}

export default function CreateUseCaseDialog({ open, onOpenChange, phases, releases }: CreateUseCaseDialogProps) {
  const createMutation = useCreateUseCase();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phaseId: phases[0]?.phaseId || '',
    mvpReleaseId: releases[0]?.releaseId || '',
    priority: UseCasePriority.p2,
    status: UseCaseStatus.proposed,
    value: UseCaseValue.med,
    effort: UseCaseEffort.m,
    owner: '',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
    onOpenChange(false);
    setFormData({
      title: '',
      description: '',
      phaseId: phases[0]?.phaseId || '',
      mvpReleaseId: releases[0]?.releaseId || '',
      priority: UseCasePriority.p2,
      status: UseCaseStatus.proposed,
      value: UseCaseValue.med,
      effort: UseCaseEffort.m,
      owner: '',
      tags: '',
    });
  };

  const priorities = [UseCasePriority.p0, UseCasePriority.p1, UseCasePriority.p2, UseCasePriority.p3];
  const statuses = [UseCaseStatus.proposed, UseCaseStatus.approved, UseCaseStatus.inBuild, UseCaseStatus.test, UseCaseStatus.done, UseCaseStatus.deferred];
  const values = [UseCaseValue.high, UseCaseValue.med, UseCaseValue.low];
  const efforts = [UseCaseEffort.s, UseCaseEffort.m, UseCaseEffort.l];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Use Case</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="phase">Phase *</Label>
            <Select
              value={formData.phaseId}
              onValueChange={(value) => setFormData({ ...formData, phaseId: value })}
              required
            >
              <SelectTrigger id="phase">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {phases.map((p) => (
                  <SelectItem key={p.phaseId} value={p.phaseId}>
                    {p.phaseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="release">Release *</Label>
            <Select
              value={formData.mvpReleaseId}
              onValueChange={(value) => setFormData({ ...formData, mvpReleaseId: value })}
              required
            >
              <SelectTrigger id="release">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {releases.map((r) => (
                  <SelectItem key={r.releaseId} value={r.releaseId}>
                    {r.releaseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as UseCasePriority })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {getPriorityLabel(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as UseCaseStatus })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {getStatusLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="value">Value</Label>
              <Select
                value={formData.value}
                onValueChange={(value) => setFormData({ ...formData, value: value as UseCaseValue })}
              >
                <SelectTrigger id="value">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {values.map((v) => (
                    <SelectItem key={v} value={v}>
                      {getValueLabel(v)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="effort">Effort</Label>
              <Select
                value={formData.effort}
                onValueChange={(value) => setFormData({ ...formData, effort: value as UseCaseEffort })}
              >
                <SelectTrigger id="effort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {efforts.map((e) => (
                    <SelectItem key={e} value={e}>
                      {getEffortLabel(e)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="comma, separated, tags"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Use Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
