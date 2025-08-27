import { fetchTasks, invalidateTaskCache } from '../utils/mockApi';
import { Task } from '../types';

const cache = new Map<string, { status: 'pending' | 'resolved' | 'rejected', data?: Task[], error?: Error, promise?: Promise<Task[]> }>();

export function useSuspenseData(): Task[] {
  const cacheKey = 'tasks';
  const cached = cache.get(cacheKey);

  if (cached) {
    switch (cached.status) {
      case 'resolved':
        return cached.data!;
      case 'rejected':
        throw cached.error;
      case 'pending':
        throw cached.promise;
    }
  }

  const promise = fetchTasks()
    .then((data) => {
      cache.set(cacheKey, { status: 'resolved', data });
      return data;
    })
    .catch((error) => {
      cache.set(cacheKey, { status: 'rejected', error });
      throw error;
    });

  cache.set(cacheKey, { status: 'pending', promise });
  throw promise;
}

export function invalidateSuspenseCache() {
  cache.delete('tasks');
  invalidateTaskCache();
}

export function useRefreshData() {
  return () => {
    invalidateSuspenseCache();
  };
}
