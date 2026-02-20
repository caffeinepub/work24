import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Material {
    id: bigint;
    name: string;
    description: string;
    timestamp: Time;
    category: string;
    location: string;
    images: Array<ExternalBlob>;
}
export interface ContactRequest {
    id: bigint;
    customerName: string;
    timestamp: Time;
    targetType: string;
    mobile: string;
    requirements: string;
    targetId: bigint;
}
export type Time = bigint;
export interface Message {
    id: bigint;
    text: string;
    personName: string;
    timestamp: Time;
}
export interface CareerApplication {
    id: bigint;
    name: string;
    experience: string;
    message: string;
    timestamp: Time;
    mobile: string;
    skills: string;
}
export interface ArchitectProject {
    id: bigint;
    files: Array<ExternalBlob>;
    projectType: string;
    name: string;
    message: string;
    timestamp: Time;
    budget: string;
    location: string;
}
export interface Worker {
    id: bigint;
    profileImage: ExternalBlob;
    name: string;
    skill: string;
    timestamp: Time;
    category: string;
    location: string;
    workImages: Array<ExternalBlob>;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMaterial(name: string, category: string, description: string, location: string, images: Array<ExternalBlob>): Promise<void>;
    addMessage(message: string, name: string): Promise<void>;
    addWorker(name: string, skill: string, category: string, location: string, profileImage: ExternalBlob, workImages: Array<ExternalBlob>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAllMessages(): Promise<bigint>;
    deleteMessage(messageId: bigint): Promise<boolean>;
    getAdminMessages(): Promise<Array<Message>>;
    getAllArchitectProjects(): Promise<Array<ArchitectProject>>;
    getAllCareerApplications(): Promise<Array<CareerApplication>>;
    getAllContactRequests(): Promise<Array<ContactRequest>>;
    getAllMaterials(): Promise<Array<Material>>;
    getAllMessages(): Promise<Array<Message>>;
    getAllWorkers(): Promise<Array<Worker>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkersByCategory(category: string): Promise<Array<Worker>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitArchitectProject(name: string, projectType: string, location: string, budget: string, message: string, files: Array<ExternalBlob>): Promise<void>;
    submitCareerApplication(name: string, mobile: string, skills: string, experience: string, message: string): Promise<void>;
    submitContactRequest(customerName: string, mobile: string, requirements: string, targetId: bigint, targetType: string): Promise<void>;
}
