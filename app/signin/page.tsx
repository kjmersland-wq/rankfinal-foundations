'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase-client';

// Disable static generation for this auth page
export const dynamic = 'force-dynamic';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const supabase = createClient(); // Create client directly, no need for state
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
          }
        });
        if (signUpError) throw signUpError;
        // Show success message for signup
        setError('');
        alert('Check your email to confirm your account!');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        if (signInError) throw signInError;
        router.push(redirect);
        router.refresh(); // Refresh to update auth state
      }
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-16 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-block rounded-full bg-accent-amber/10 px-3 py-1 text-xs font-bold text-accent-amber">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary">
            {mode === 'signin' ? 'Welcome back' : 'Join RankFinal'}
          </h1>
          <p className="text-text-secondary">
            {mode === 'signin'
              ? 'Sign in to your account to continue'
              : 'Create an account to get started'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent-amber focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent-amber focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="w-full bg-accent-amber text-primary-foreground hover:bg-accent-amber/90"
          >
            {loading
              ? 'Please wait...'
              : mode === 'signin'
              ? 'Sign in →'
              : 'Create account →'}
          </Button>
        </div>

        <p className="text-center text-sm text-text-secondary">
          {mode === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-bold text-accent-amber hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="font-bold text-accent-amber hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        <p className="text-center text-xs text-text-secondary">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-text-primary">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[70vh] items-center justify-center py-16 px-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent-amber border-r-transparent"></div>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
