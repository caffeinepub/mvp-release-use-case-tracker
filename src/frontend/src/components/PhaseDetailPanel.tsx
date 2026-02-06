import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Save, Trash2 } from 'lucide-react';
import { useUpdatePhase, useDeletePhase } from '../hooks/useQueries';
import { Phase, Release, PhaseStatus } from '../backend';
import { getPhaseStatusLabel } from '../lib/labels';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PhaseDetailPanelProps {
  phase: Phase;
  releases: Release[];
  onClose: () => void;
}

export default function PhaseDetailPanel({
  phase,
  releases,
  onClose,
}: PhaseDetailPanelProps) {
  const [editedPhase, setEditedPhase] = useState(phase);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateMutation = useUpdatePhase();
  const deleteMutation = useDeletePhase();

  useEffect(() => {
    setEditedPhase(phase);
  }, [phase]);

  const handleSave = async () => {
    await updateMutation.mutateAsync(editedPhase);
    onClose();
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(phase.phaseId);
    setShowDeleteDialog(false);
    onClose();
  };

  const statuses = [PhaseStatus.planned, PhaseStatus.inProgress, PhaseStatus.completed];

  return (
    <>
      <aside className="w-96 border-l bg-card flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Phase Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="phaseId">Phase ID</Label>
              <Input
                id="phaseId"
                value={editedPhase.phaseId}
                onChange={(e) => setEditedPhase({ ...editedPhase, phaseId: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phaseName">Phase Name</Label>
              <Input
                id="phaseName"
                value={editedPhase.phaseName}
                onChange={(e) => setEditedPhase({ ...editedPhase, phaseName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phaseGoal">Phase Goal</Label>
              <Textarea
                id="phaseGoal"
                value={editedPhase.phaseGoal}
                onChange={(e) => setEditedPhase({ ...editedPhase, phaseGoal: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                value={editedPhase.targetDate}
                onChange={(e) => setEditedPhase({ ...editedPhase, targetDate: e.target.value })}
                placeholder="e.g., Q1 2025"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedPhase.status}
                onValueChange={(value) =>
                  setEditedPhase({ ...editedPhase, status: value as PhaseStatus })
                }
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

            <div>
              <Label htmlFor="release">Release</Label>
              <Select
                value={editedPhase.releaseId}
                onValueChange={(value) => setEditedPhase({ ...editedPhase, releaseId: value })}
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
        </ScrollArea>

        <div className="p-4 border-t space-y-2">
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </aside>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Phase?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{phase.phaseName}" and all associated use cases. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
