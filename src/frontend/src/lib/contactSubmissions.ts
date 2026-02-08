import { useActor } from '../hooks/useActor';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface ContactSubmission {
  workerName?: string;
  customerName: string;
  mobile: string;
  requirement: string;
  type: 'worker' | 'material' | 'career' | 'architect';
}

export function useSubmitContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: ContactSubmission) => {
      if (!actor) throw new Error('Actor not initialized');
      
      const message = JSON.stringify({
        type: submission.type,
        workerName: submission.workerName,
        customerName: submission.customerName,
        mobile: submission.mobile,
        requirement: submission.requirement,
        timestamp: new Date().toISOString(),
      });
      
      await actor.addMessage(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}
