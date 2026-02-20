import { useActor } from '../hooks/useActor';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface ContactSubmission {
  workerName?: string;
  customerName: string;
  mobile: string;
  requirement: string;
  type: 'worker' | 'material' | 'career' | 'architect';
  origin?: string;
}

export function useSubmitContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: ContactSubmission) => {
      if (!actor) throw new Error('Actor not initialized');
      
      const message = JSON.stringify({
        type: submission.type,
        origin: submission.origin || 'unknown',
        workerName: submission.workerName,
        customerName: submission.customerName,
        mobile: submission.mobile,
        requirement: submission.requirement,
        timestamp: new Date().toISOString(),
      });
      
      // addMessage requires both message and name parameters
      await actor.addMessage(message, submission.customerName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
    },
  });
}
