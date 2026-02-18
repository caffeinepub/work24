import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getAdminSession } from '../lib/adminSession';
import type { Time } from '../backend';

export function useGetAdminMessages() {
  const { actor, isFetching } = useActor();
  const adminSession = getAdminSession();

  return useQuery<Array<[bigint, string, Time]>>({
    queryKey: ['adminMessages', adminSession?.adminId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!adminSession) throw new Error('Admin session not found');
      
      return actor.getAdminMessages(adminSession.adminId, adminSession.password);
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
      
      const result = await actor.deleteMessage(
        adminSession.adminId,
        adminSession.password,
        messageId
      );
      
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
