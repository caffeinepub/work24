import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Time } from '../backend';

export function useGetAdminMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, Time]>>({
    queryKey: ['adminMessages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminMessages();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}
