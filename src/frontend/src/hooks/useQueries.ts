import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Message, Worker, Material } from '../backend';

export function useGetAdminMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['adminMessages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminMessages();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetAllMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.deleteMessage(messageId);
      if (!result) {
        throw new Error('Message not found or could not be deleted');
      }
      return result;
    },
    onSuccess: () => {
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
      return actor.getAllWorkers();
    },
    enabled: !!actor && !isFetching,
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
      return actor.getAllMaterials();
    },
    enabled: !!actor && !isFetching,
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
      return actor.addMaterial(
        data.name,
        data.category,
        data.description,
        data.location,
        data.images
      );
    },
    onSuccess: () => {
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
      return actor.submitContactRequest(
        data.customerName,
        data.mobile,
        data.requirements,
        data.targetId,
        data.targetType
      );
    },
    onSuccess: () => {
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

export function useAdminLogin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminLogin(credentials.username, credentials.password);
    },
  });
}
