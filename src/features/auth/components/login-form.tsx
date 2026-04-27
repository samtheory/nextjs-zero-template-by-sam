'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  loginSchema,
  requestPasswordResetSchema,
  type LoginFormValues,
  type RequestPasswordResetFormValues,
} from '../validators/auth.schema';
import { useLogin } from '../hooks/use-login';
import { useRequestPasswordReset } from '../hooks/use-password-reset';

type LoginView = 'login' | 'forgot-password' | 'forgot-sent';

export function LoginForm() {
  const router = useRouter();
  const [view, setView] = useState<LoginView>('login');

  const { login, isPending: isLoginPending, isError: isLoginError, error: loginError } = useLogin();
  const {
    request: requestReset,
    isPending: isResetPending,
    isError: isResetError,
    error: resetError,
  } = useRequestPasswordReset();

  // ─── Login form ─────────────────────────────────────────────────────────────
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onLogin = async (values: LoginFormValues) => {
    await login({ identity: values.identity, password: values.password });
    router.push('/');
  };

  // ─── Forgot password form ────────────────────────────────────────────────────
  const resetForm = useForm<RequestPasswordResetFormValues>({
    resolver: zodResolver(requestPasswordResetSchema),
  });

  const onRequestReset = async (values: RequestPasswordResetFormValues) => {
    await requestReset({ email: values.email });
    setView('forgot-sent');
  };

  // ─── Forgot-sent view ────────────────────────────────────────────────────────
  if (view === 'forgot-sent') {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          Password reset email sent. Check your inbox.
        </div>
        <button
          type="button"
          onClick={() => setView('login')}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to login
        </button>
      </div>
    );
  }

  // ─── Forgot-password view ────────────────────────────────────────────────────
  if (view === 'forgot-password') {
    return (
      <form
        onSubmit={resetForm.handleSubmit(onRequestReset)}
        className="space-y-4"
        noValidate
      >
        <p className="text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a reset link.
        </p>

        <div className="flex flex-col gap-1">
          <label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...resetForm.register('email')}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
          />
          {resetForm.formState.errors.email && (
            <p className="text-xs text-red-500">
              {resetForm.formState.errors.email.message}
            </p>
          )}
        </div>

        {isResetError && resetError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {resetError.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isResetPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isResetPending ? 'Sending…' : 'Send reset link'}
        </button>

        <button
          type="button"
          onClick={() => setView('login')}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
        >
          Back to login
        </button>
      </form>
    );
  }

  // ─── Login view ──────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={loginForm.handleSubmit(onLogin)}
      className="space-y-4"
      noValidate
    >
      {/* Email / Identity */}
      <div className="flex flex-col gap-1">
        <label htmlFor="identity" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="identity"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...loginForm.register('identity')}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
        />
        {loginForm.formState.errors.identity && (
          <p className="text-xs text-red-500">
            {loginForm.formState.errors.identity.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <button
            type="button"
            onClick={() => setView('forgot-password')}
            className="text-xs text-blue-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          {...loginForm.register('password')}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
        />
        {loginForm.formState.errors.password && (
          <p className="text-xs text-red-500">
            {loginForm.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* API error */}
      {isLoginError && loginError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {loginError.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoginPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoginPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
