import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Save, Trash2 } from 'lucide-react';
import { useUpdateRelease, useDeleteRelease } from '../hooks/useQueries';
import { Release, ReleaseStatus } from '../backend';
import { getReleaseStatusLabel } from '../lib/labels';
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

interface ReleaseDetailPanelProps {
  release: Release;
  onClose: () => void;
}

export default function ReleaseDetailPanel({ release, onClose }: ReleaseDetailPanelProps) {
  const [editedRelease, setEditedRelease] = useState(release);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateMutation = useUpdateRelease();
  const deleteMutation = useDeleteRelease();

  useEffect(() => {
    setEditedRelease(release);
  }, [release]);

  const handleSave = async () => {
    await updateMutation.mutateAsync(editedRelease);
    onClose();
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(release.releaseId);
    setShowDeleteDialog(false);
    onClose();
  };

  const statuses = [ReleaseStatus.planned, ReleaseStatus.inProgress, ReleaseStatus.released];

  return (
    <>
      <aside className="w-96 border-l bg-card flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Release Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="releaseId">Release ID</Label>
              <Input
                id="releaseId"
                value={editedRelease.releaseId}
                onChange={(e) => setEditedRelease({ ...editedRelease, releaseId: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="releaseName">Name</Label>
              <Input
                id="releaseName"
                value={editedRelease.releaseName}
                onChange={(e) => setEditedRelease({ ...editedRelease, releaseName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="releaseGoal">Goal</Label>
              <Textarea
                id="releaseGoal"
                value={editedRelease.releaseGoal}
                onChange={(e) => setEditedRelease({ ...editedRelease, releaseGoal: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                value={editedRelease.targetDate}
                onChange={(e) => setEditedRelease({ ...editedRelease, targetDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedRelease.status}
                onValueChange={(value) =>
                  setEditedRelease({ ...editedRelease, status: value as ReleaseStatus })
                }
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
          </div>
        </ScrollArea>

        <div className="p-4 border-t space-y-2">
          <Button className="w-full" onClick={handleSave} disabled={updateMutation.isPending}>
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
            Delete Release
          </Button>
        </div>
      </aside>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Release?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{release.releaseName}" and all associated use cases. This action cannot be
              undone.
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
