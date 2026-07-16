import { writable, get } from 'svelte/store';
import type { Session, User } from '@supabase/supabase-js';
import { push } from 'svelte-spa-router';
import { clearAllChatState } from '@/lib/chat-threads';
import { supabase } from '@/lib/supabase';

export const user = writable<User | null>(null);
export const session = writable<Session | null>(null);
export const authLoading = writable(true);

const AUTH_PAGES = ['login', 'signup', 'recover-password', 'reset-password'];

export function isAuthPage(path: string): boolean {
  const segment = path.replace(/^\//, '').split('/')[0] ?? '';
  return AUTH_PAGES.includes(segment);
}

export async function initAuth(): Promise<() => void> {
  let isInitialized = false;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, nextSession) => {
    if (!isInitialized) {
      isInitialized = true;
      authLoading.set(false);
    }

    if (nextSession) {
      user.set(nextSession.user);
      session.set(nextSession);
      localStorage.setItem('x-auth-token', nextSession.access_token);
    } else {
      user.set(null);
      session.set(null);
      localStorage.removeItem('x-auth-token');
    }
  });

  return () => subscription.unsubscribe();
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}

export async function signUp(email: string, password: string) {
  const { error } = await supabase.auth.signUp({ email, password });
  return { error };
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error };
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  return { error };
}

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  return { error };
}

export async function signOut() {
  clearAllChatState();
  await supabase.auth.signOut();
  push('/login');
}

export async function refreshToken() {
  const { data, error } = await supabase.auth.refreshSession();
  if (data.session) {
    localStorage.setItem('x-auth-token', data.session.access_token);
  }
  return { data, error };
}

export function isAuthenticated(): boolean {
  return get(user) !== null;
}

export function isGuest(): boolean {
  return get(user) === null;
}
