import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useGetAllReleases } from '../hooks/useQueries';
import ReleaseTable from '../components/ReleaseTable';
import ReleaseDetailPanel from '../components/ReleaseDetailPanel';
import CreateReleaseDialog from '../components/CreateReleaseDialog';
import type { Release } from '../backend';

export default function ReleasesPage() {
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: releases = [], isLoading } = useGetAllReleases();

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Releases</h2>
          <Button onClick={() => setShowCreateDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Release
          </Button>
        </div>

        {/* Table */}
        <ReleaseTable
          releases={releases}
          onSelectRelease={setSelectedRelease}
          isLoading={isLoading}
        />
      </div>

      {/* Detail Panel */}
      {selectedRelease && (
        <ReleaseDetailPanel
          release={selectedRelease}
          onClose={() => setSelectedRelease(null)}
        />
      )}

      {/* Create Dialog */}
      <CreateReleaseDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  );
}
