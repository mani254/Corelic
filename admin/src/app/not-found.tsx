'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="mt-4 text-3xl font-semibold">Page Not Found</h2>
      <p className="mt-2 max-w-md text-gray-800">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link href="/">
        <button className="mt-6 rounded-lg bg-primary-500 px-6 py-3 text-lg font-medium hover:bg-primary-400 transition text-white">
          Go Back Home
        </button>
      </Link>
    </div>
  );
}
