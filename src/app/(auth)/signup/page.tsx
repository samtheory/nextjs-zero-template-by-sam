import { SignupForm } from '@/features/auth/components/signup-form';
import Link from 'next/link';

export const metadata = {
  title: 'Create account',
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white px-8 py-10 shadow-sm ring-1 ring-gray-200">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="mt-1 text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <SignupForm />
        </div>
      </div>
    </main>
  );
}
