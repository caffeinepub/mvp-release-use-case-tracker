import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreatePhase } from '../hooks/useQueries';
import { Phase, PhaseStatus, Release } from '../backend';
import { getPhaseStatusLabel } from '../lib/labels';

interface CreatePhaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  releases: Release[];
}

export default function CreatePhaseDialog({ open, onOpenChange, releases }: CreatePhaseDialogProps) {
  const [formData, setFormData] = useState<Omit<Phase, 'status' | 'releaseId'> & { status: PhaseStatus; releaseId: string }>({
    phaseId: '',
    phaseName: '',
    phaseGoal: '',
    targetDate: '',
    status: PhaseStatus.planned,
    releaseId: releases[0]?.releaseId || '',
  });

  const createMutation = useCreatePhase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
    onOpenChange(false);
    setFormData({
      phaseId: '',
      phaseName: '',
      phaseGoal: '',
      targetDate: '',
      status: PhaseStatus.planned,
      releaseId: releases[0]?.releaseId || '',
    });
  };

  const statuses = [PhaseStatus.planned, PhaseStatus.inProgress, PhaseStatus.completed];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Phase</DialogTitle>
          <DialogDescription>Add a new phase to organize your use cases</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phaseId">Phase ID *</Label>
                <Input
                  id="phaseId"
                  value={formData.phaseId}
                  onChange={(e) => setFormData({ ...formData, phaseId: e.target.value })}
                  placeholder="e.g., Phase-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phaseName">Phase Name *</Label>
                <Input
                  id="phaseName"
                  value={formData.phaseName}
                  onChange={(e) => setFormData({ ...formData, phaseName: e.target.value })}
                  placeholder="e.g., Discovery"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phaseGoal">Phase Goal</Label>
              <Textarea
                id="phaseGoal"
                value={formData.phaseGoal}
                onChange={(e) => setFormData({ ...formData, phaseGoal: e.target.value })}
                placeholder="Describe the goal of this phase"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  placeholder="e.g., Q1 2025"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as PhaseStatus })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {getPhaseStatusLabel(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="release">Release *</Label>
              <Select
                value={formData.releaseId}
                onValueChange={(value) => setFormData({ ...formData, releaseId: value })}
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Phase'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
