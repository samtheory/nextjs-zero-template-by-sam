import { LoginForm } from '@/features/auth/components/login-form';
import Link from 'next/link';

export const metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white px-8 py-10 shadow-sm ring-1 ring-gray-200">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="mt-1 text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
