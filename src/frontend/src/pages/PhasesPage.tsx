import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PhaseTable from '../components/PhaseTable';
import PhaseDetailPanel from '../components/PhaseDetailPanel';
import CreatePhaseDialog from '../components/CreatePhaseDialog';
import { useGetAllPhases, useGetAllReleases } from '../hooks/useQueries';
import type { Phase } from '../backend';

export default function PhasesPage() {
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: phases = [], isLoading: phasesLoading } = useGetAllPhases();
  const { data: releases = [], isLoading: releasesLoading } = useGetAllReleases();

  const isLoading = phasesLoading || releasesLoading;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Phases</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage project phases and their goals
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Phase
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <PhaseTable
            phases={phases}
            releases={releases}
            onSelectPhase={setSelectedPhase}
            isLoading={isLoading}
          />
        </div>
      </div>

      {selectedPhase && (
        <PhaseDetailPanel
          phase={selectedPhase}
          releases={releases}
          onClose={() => setSelectedPhase(null)}
        />
      )}

      <CreatePhaseDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        releases={releases}
      />
    </div>
  );
}
