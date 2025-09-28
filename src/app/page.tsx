"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rankify</h1>
          <p className="text-gray-600">Resume Review Platform</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium text-center block"
          >
            Sign In
          </Link>

          <Link
            href="/auth/sign-up"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium text-center block"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Get started with your account</p>
        </div>
      </div>
    </div>
  );
}
