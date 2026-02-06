import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UseCase,
  Release,
  Phase,
  AppConfig,
} from '../backend';
import { toast } from 'sonner';

// AppConfig queries
export function useGetAppConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<AppConfig>({
    queryKey: ['appConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAppConfig();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useUpdateAppConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: AppConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAppConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appConfig'] });
      toast.success('Configuration updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update configuration: ${error.message}`);
    },
  });
}

// UseCase queries
export function useGetAllUseCases() {
  const { actor, isFetching } = useActor();

  return useQuery<UseCase[]>({
    queryKey: ['useCases'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUseCases();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateUseCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uc: Omit<UseCase, 'ucId' | 'createdDate' | 'lastUpdated'>) => {
      if (!actor) throw new Error('Actor not available');
      const newUc: UseCase = {
        ...uc,
        ucId: '',
        createdDate: BigInt(0),
        lastUpdated: BigInt(0),
      };
      return actor.createUseCase(newUc);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useCases'] });
      toast.success('Use case created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create use case: ${error.message}`);
    },
  });
}

export function useUpdateUseCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uc: UseCase) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUseCase(uc);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useCases'] });
      toast.success('Use case updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update use case: ${error.message}`);
    },
  });
}

export function useDeleteUseCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteUseCase(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useCases'] });
      toast.success('Use case deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete use case: ${error.message}`);
    },
  });
}

export function useChangeUseCasePhase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ucId, newPhaseId }: { ucId: string; newPhaseId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.changeUseCasePhase(ucId, newPhaseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useCases'] });
      toast.success('Use case phase updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update phase: ${error.message}`);
    },
  });
}

// Phase queries
export function useGetAllPhases() {
  const { actor, isFetching } = useActor();

  return useQuery<Phase[]>({
    queryKey: ['phases'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPhases();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePhase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (phase: Phase) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPhase(phase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
      toast.success('Phase created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create phase: ${error.message}`);
    },
  });
}

export function useUpdatePhase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (phase: Phase) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePhase(phase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
      toast.success('Phase updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update phase: ${error.message}`);
    },
  });
}

export function useDeletePhase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePhase(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
      queryClient.invalidateQueries({ queryKey: ['useCases'] });
      toast.success('Phase deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete phase: ${error.message}`);
    },
  });
}

export function useChangePhaseRelease() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ phaseId, newReleaseId }: { phaseId: string; newReleaseId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.changePhaseRelease(phaseId, newReleaseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
      toast.success('Phase release updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update release: ${error.message}`);
    },
  });
}

// Release queries
export function useGetAllReleases() {
  const { actor, isFetching } = useActor();

  return useQuery<Release[]>({
    queryKey: ['releases'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReleases();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRelease() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (release: Release) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createRelease(release);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      toast.success('Release created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create release: ${error.message}`);
    },
  });
}

export function useUpdateRelease() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (release: Release) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRelease(release);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      toast.success('Release updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update release: ${error.message}`);
    },
  });
}

export function useDeleteRelease() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteRelease(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      queryClient.invalidateQueries({ queryKey: ['useCases'] });
      toast.success('Release deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete release: ${error.message}`);
    },
  });
}
