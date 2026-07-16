import { API_BASE_URL, apiFetch } from '@/lib/api';

export type HealthStatus = 'online' | 'offline' | 'checking';

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export async function fetchHealth(): Promise<{
  data?: HealthResponse;
  error?: string;
}> {
  const url = new URL('/health', API_BASE_URL);
  return apiFetch(url, { method: 'GET' }, false);
}

const POLL_INTERVAL_MS = 30_000;

export function startHealthPolling(
  onStatus: (status: HealthStatus) => void,
): () => void {
  let cancelled = false;

  const check = async () => {
    const { data, error } = await fetchHealth();
    if (cancelled) return;
    onStatus(data && !error ? 'online' : 'offline');
  };

  onStatus('checking');
  check();
  const interval = setInterval(check, POLL_INTERVAL_MS);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}
