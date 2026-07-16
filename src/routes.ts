import { wrap } from 'svelte-spa-router/wrap';
import { isAuthenticated, isGuest } from '@/lib/auth';
import Home from '@/routes/Home.svelte';
import Login from '@/routes/Login.svelte';
import Signup from '@/routes/Signup.svelte';
import RecoverPassword from '@/routes/RecoverPassword.svelte';
import ResetPassword from '@/routes/ResetPassword.svelte';
import Chat from '@/routes/Chat.svelte';
import RedirectHome from '@/routes/RedirectHome.svelte';

export const routes = {
  '/': wrap({
    component: Home,
    conditions: [isAuthenticated],
    userData: { redirect: '/login', saveReturnTo: true },
  }),
  '/login': wrap({
    component: Login,
    conditions: [isGuest],
    userData: { redirect: '/' },
  }),
  '/signup': wrap({
    component: Signup,
    conditions: [isGuest],
    userData: { redirect: '/' },
  }),
  '/recover-password': wrap({
    component: RecoverPassword,
    conditions: [isGuest],
    userData: { redirect: '/' },
  }),
  '/reset-password': wrap({
    component: ResetPassword,
    conditions: [isAuthenticated],
    userData: { redirect: '/login', saveReturnTo: true },
  }),
  '/chat': wrap({
    component: Chat,
    conditions: [isAuthenticated],
    userData: { redirect: '/login', saveReturnTo: true },
  }),
  '*': RedirectHome,
};
