import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetMessages() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages();
    },
    enabled: !!actor && !isFetching,
  });
}
