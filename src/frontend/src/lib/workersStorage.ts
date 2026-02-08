import { Worker } from '../types/workers';

const WORKERS_KEY = 'work24_workers';

export function getWorkers(): Worker[] {
  const stored = localStorage.getItem(WORKERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getWorkersByService(serviceId: string): Worker[] {
  const workers = getWorkers();
  return workers.filter(w => w.serviceCategory === serviceId);
}

export function addWorker(worker: Omit<Worker, 'id'>): Worker {
  const workers = getWorkers();
  const newWorker: Worker = {
    ...worker,
    id: `worker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  workers.push(newWorker);
  localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));
  return newWorker;
}
