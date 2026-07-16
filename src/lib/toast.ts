import { writable } from 'svelte/store';

export type ToastKind = 'success' | 'error';

export type ToastMessage = {
  id: number;
  kind: ToastKind;
  message: string;
};

export const toasts = writable<ToastMessage[]>([]);

let nextId = 0;

export function showToast(kind: ToastKind, message: string, durationMs = 4000) {
  const id = ++nextId;
  toasts.update((list) => [...list, { id, kind, message }]);
  setTimeout(() => {
    toasts.update((list) => list.filter((t) => t.id !== id));
  }, durationMs);
}

export function toastError(message: string) {
  showToast('error', message);
}

export function toastSuccess(message: string) {
  showToast('success', message);
}
