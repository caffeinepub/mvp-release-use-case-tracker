import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateRelease } from '../hooks/useQueries';
import { ReleaseStatus } from '../backend';
import { getReleaseStatusLabel } from '../lib/labels';

interface CreateReleaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateReleaseDialog({ open, onOpenChange }: CreateReleaseDialogProps) {
  const createMutation = useCreateRelease();

  const [formData, setFormData] = useState({
    releaseId: '',
    releaseName: '',
    releaseGoal: '',
    targetDate: '',
    status: ReleaseStatus.planned,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
    onOpenChange(false);
    setFormData({
      releaseId: '',
      releaseName: '',
      releaseGoal: '',
      targetDate: '',
      status: ReleaseStatus.planned,
    });
  };

  const statuses = [ReleaseStatus.planned, ReleaseStatus.inProgress, ReleaseStatus.released];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Release</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="releaseId">Release ID *</Label>
            <Input
              id="releaseId"
              value={formData.releaseId}
              onChange={(e) => setFormData({ ...formData, releaseId: e.target.value })}
              placeholder="e.g., MVP-0, MVP-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="releaseName">Name *</Label>
            <Input
              id="releaseName"
              value={formData.releaseName}
              onChange={(e) => setFormData({ ...formData, releaseName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="releaseGoal">Goal</Label>
            <Textarea
              id="releaseGoal"
              value={formData.releaseGoal}
              onChange={(e) => setFormData({ ...formData, releaseGoal: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              placeholder="e.g., Q1 2025, 2025-03-31"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as ReleaseStatus })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {getReleaseStatusLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Release'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
