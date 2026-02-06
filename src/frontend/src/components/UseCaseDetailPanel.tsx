import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Save, Copy, Trash2 } from 'lucide-react';
import { useUpdateUseCase, useDeleteUseCase, useCreateUseCase } from '../hooks/useQueries';
import { UseCase, Phase, Release, UseCasePriority, UseCaseStatus, UseCaseValue, UseCaseEffort } from '../backend';
import { getPriorityLabel, getStatusLabel, getValueLabel, getEffortLabel } from '../lib/labels';
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

interface UseCaseDetailPanelProps {
  useCase: UseCase;
  phases: Phase[];
  releases: Release[];
  onClose: () => void;
}

export default function UseCaseDetailPanel({
  useCase,
  phases,
  releases,
  onClose,
}: UseCaseDetailPanelProps) {
  const [editedUseCase, setEditedUseCase] = useState(useCase);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateMutation = useUpdateUseCase();
  const deleteMutation = useDeleteUseCase();
  const createMutation = useCreateUseCase();

  useEffect(() => {
    setEditedUseCase(useCase);
  }, [useCase]);

  const handleSave = async () => {
    await updateMutation.mutateAsync(editedUseCase);
    onClose();
  };

  const handleDuplicate = async () => {
    const { ucId, createdDate, lastUpdated, ...rest } = editedUseCase;
    await createMutation.mutateAsync({
      ...rest,
      title: `${rest.title} (Copy)`,
    });
    onClose();
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(useCase.ucId);
    setShowDeleteDialog(false);
    onClose();
  };

  const priorities = [UseCasePriority.p0, UseCasePriority.p1, UseCasePriority.p2, UseCasePriority.p3];
  const statuses = [UseCaseStatus.proposed, UseCaseStatus.approved, UseCaseStatus.inBuild, UseCaseStatus.test, UseCaseStatus.done, UseCaseStatus.deferred];
  const values = [UseCaseValue.high, UseCaseValue.med, UseCaseValue.low];
  const efforts = [UseCaseEffort.s, UseCaseEffort.m, UseCaseEffort.l];

  return (
    <>
      <aside className="w-96 border-l bg-card flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Use Case Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">ID</Label>
              <p className="font-mono text-sm mt-1">{useCase.ucId}</p>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedUseCase.title}
                onChange={(e) => setEditedUseCase({ ...editedUseCase, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedUseCase.description}
                onChange={(e) => setEditedUseCase({ ...editedUseCase, description: e.target.value })}
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="phase">Phase</Label>
              <Select
                value={editedUseCase.phaseId}
                onValueChange={(value) => setEditedUseCase({ ...editedUseCase, phaseId: value })}
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
              <Label htmlFor="release">Release</Label>
              <Select
                value={editedUseCase.mvpReleaseId}
                onValueChange={(value) => setEditedUseCase({ ...editedUseCase, mvpReleaseId: value })}
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
                  value={editedUseCase.priority}
                  onValueChange={(value) =>
                    setEditedUseCase({ ...editedUseCase, priority: value as UseCasePriority })
                  }
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
                  value={editedUseCase.status}
                  onValueChange={(value) =>
                    setEditedUseCase({ ...editedUseCase, status: value as UseCaseStatus })
                  }
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
                  value={editedUseCase.value}
                  onValueChange={(value) =>
                    setEditedUseCase({ ...editedUseCase, value: value as UseCaseValue })
                  }
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
                  value={editedUseCase.effort}
                  onValueChange={(value) =>
                    setEditedUseCase({ ...editedUseCase, effort: value as UseCaseEffort })
                  }
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
                value={editedUseCase.owner}
                onChange={(e) => setEditedUseCase({ ...editedUseCase, owner: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={editedUseCase.tags}
                onChange={(e) => setEditedUseCase({ ...editedUseCase, tags: e.target.value })}
                placeholder="comma, separated, tags"
              />
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDuplicate}
              disabled={createMutation.isPending}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </aside>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Use Case?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{useCase.title}". This action cannot be undone.
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
