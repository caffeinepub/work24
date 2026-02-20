import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Message, Worker, Material } from '../backend';

export function useGetAdminMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['adminMessages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useGetAdminMessages] Fetching admin messages...');
      const messages = await actor.getAdminMessages();
      console.log('[useGetAdminMessages] Received messages:', {
        count: messages.length,
        messageIds: messages.map(m => m.id.toString()),
        timestamps: messages.map(m => new Date(Number(m.timestamp) / 1000000).toISOString())
      });
      return messages;
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetAllMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useGetAllMessages] Fetching all messages from backend...');
      const messages = await actor.getAllMessages();
      console.log('[useGetAllMessages] Successfully received messages:', {
        count: messages.length,
        messageIds: messages.map(m => m.id.toString()),
        timestamps: messages.map(m => new Date(Number(m.timestamp) / 1000000).toISOString()),
        firstFewTexts: messages.slice(0, 3).map(m => m.text.substring(0, 50))
      });
      return messages;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000, // Refetch every 10 seconds to catch cross-device updates
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 0, // Always consider data stale to ensure fresh fetches
  });
}

export function useDeleteMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useDeleteMessage] Deleting message:', messageId.toString());
      const result = await actor.deleteMessage(messageId);
      if (!result) {
        throw new Error('Message not found or could not be deleted');
      }
      console.log('[useDeleteMessage] Message deleted successfully');
      return result;
    },
    onSuccess: () => {
      console.log('[useDeleteMessage] Invalidating message queries');
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

export function useGetAllWorkers() {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: ['workers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useGetAllWorkers] Fetching all workers...');
      const workers = await actor.getAllWorkers();
      console.log('[useGetAllWorkers] Received workers:', workers.length);
      return workers;
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetWorkersByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: ['workers', category],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWorkersByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetAllMaterials() {
  const { actor, isFetching } = useActor();

  return useQuery<Material[]>({
    queryKey: ['materials'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useGetAllMaterials] Fetching all materials...');
      const materials = await actor.getAllMaterials();
      console.log('[useGetAllMaterials] Received materials:', materials.length);
      return materials;
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useAddWorker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      skill: string;
      category: string;
      location: string;
      profileImage: any;
      workImages: any[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useAddWorker] Adding worker:', data.name);
      return actor.addWorker(
        data.name,
        data.skill,
        data.category,
        data.location,
        data.profileImage,
        data.workImages
      );
    },
    onSuccess: () => {
      console.log('[useAddWorker] Worker added, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
    },
  });
}

export function useAddMaterial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      description: string;
      location: string;
      images: any[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useAddMaterial] Adding material:', data.name);
      return actor.addMaterial(
        data.name,
        data.category,
        data.description,
        data.location,
        data.images
      );
    },
    onSuccess: () => {
      console.log('[useAddMaterial] Material added, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
    },
  });
}

export function useSubmitContactRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      mobile: string;
      requirements: string;
      targetId: bigint;
      targetType: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useSubmitContactRequest] Submitting contact request for:', data.targetType, data.targetId.toString());
      return actor.submitContactRequest(
        data.customerName,
        data.mobile,
        data.requirements,
        data.targetId,
        data.targetType
      );
    },
    onSuccess: () => {
      console.log('[useSubmitContactRequest] Contact request submitted, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

export function useSubmitCareerApplication() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      mobile: string;
      skills: string;
      experience: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useSubmitCareerApplication] Submitting career application for:', data.name);
      return actor.submitCareerApplication(
        data.name,
        data.mobile,
        data.skills,
        data.experience,
        data.message
      );
    },
  });
}

export function useSubmitArchitectProject() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      projectType: string;
      location: string;
      budget: string;
      message: string;
      files: any[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useSubmitArchitectProject] Submitting architect project for:', data.name);
      return actor.submitArchitectProject(
        data.name,
        data.projectType,
        data.location,
        data.budget,
        data.message,
        data.files
      );
    },
  });
}

export function useVerifyAdminAccess() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Try to call an admin-only method to verify access
      try {
        await actor.getAdminMessages();
        return true;
      } catch (error) {
        return false;
      }
    },
  });
}
