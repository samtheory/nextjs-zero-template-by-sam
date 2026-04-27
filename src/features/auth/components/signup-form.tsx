'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signupSchema, type SignupFormValues } from '../validators/auth.schema';
import { useSignup } from '../hooks/use-signup';

export function SignupForm() {
  const router = useRouter();
  const { signup, isPending, isError, error } = useSignup();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { emailVisibility: false },
  });

  const onSubmit = async (values: SignupFormValues) => {
    await signup({
      email: values.email,
      name: values.name,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
      emailVisibility: values.emailVisibility,
      avatar: values.avatar,
    });
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          {...register('name')}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('email')}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          {...register('password')}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="passwordConfirm" className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          {...register('passwordConfirm')}
          className="rounded-md border border-gray-300
                      px-3 py-2 text-sm outline-none focus:border-blue-500
                      focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 text-gray-900"
        />
        {errors.passwordConfirm && (
          <p className="text-xs text-red-500">{errors.passwordConfirm.message}</p>
        )}
      </div>

      {/* Avatar */}
      <div className="flex flex-col gap-1">
        <label htmlFor="avatar" className="text-sm font-medium text-gray-700">
          Avatar <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setValue('avatar', file);
          }}
          className="text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 placeholder:text-gray-400"
        />
        {errors.avatar && (
          <p className="text-xs text-red-500">{errors.avatar.message}</p>
        )}
      </div>

      {/* Email Visibility */}
      <div className="flex items-center gap-2">
        <input
          id="emailVisibility"
          type="checkbox"
          {...register('emailVisibility')}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 placeholder:text-gray-400"
        />
        <label htmlFor="emailVisibility" className="text-sm text-gray-700">
          Make email publicly visible
        </label>
      </div>

      {/* API error */}
      {isError && error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
