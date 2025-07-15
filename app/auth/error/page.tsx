'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Component that uses useSearchParams must be wrapped in Suspense
function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams ? searchParams.get('error') : null;

  let errorMessage = 'An error occurred during authentication.';
  
  if (error === 'OAuthAccountNotLinked') {
    errorMessage = 'This email is already associated with another account. Please sign in with the original provider.';
  } else if (error === 'OAuthCallback') {
    errorMessage = 'An error occurred during the OAuth callback. Please try again.';
  } else if (error === 'OAuthCreateAccount') {
    errorMessage = 'Could not create user account. Please try again.';
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
      <p className="text-gray-700 mb-6">{errorMessage}</p>
      <div className="flex justify-end">
        <a
          href="/auth/signin"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Sign In
        </a>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<div className="bg-white p-8 rounded-lg shadow-md w-96">Loading error details...</div>}>
        <AuthError />
      </Suspense>
    </div>
  );
}
