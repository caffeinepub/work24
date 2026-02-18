import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getAdminSession } from '../lib/adminSession';
import { getMaterials } from '../lib/materialsStorage';
import { getWorkers } from '../lib/workersStorage';
import type { Time } from '../backend';
import type { Material } from '../types/materials';
import type { Worker } from '../types/workers';

export function useGetAdminMessages() {
  const { actor, isFetching } = useActor();
  const adminSession = getAdminSession();

  return useQuery<Array<[bigint, string, Time]>>({
    queryKey: ['adminMessages', adminSession?.adminId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!adminSession) throw new Error('Admin session not found');
      
      return actor.getAdminMessages();
    },
    enabled: !!actor && !isFetching && !!adminSession,
    retry: false,
  });
}

export function useDeleteMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const adminSession = getAdminSession();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminSession) throw new Error('Admin session not found');
      
      const result = await actor.deleteMessage(messageId);
      
      if (!result) {
        throw new Error('Message not found or could not be deleted');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
    },
  });
}

export function useGetMaterials() {
  return useQuery<Material[]>({
    queryKey: ['materials'],
    queryFn: () => {
      return getMaterials();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useGetWorkers() {
  return useQuery<Worker[]>({
    queryKey: ['workers'],
    queryFn: () => {
      return getWorkers();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
