'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function CatalogPage() {
  const { categories } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Category
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore ideas shared by our community. Each category offers unique insights 
            and tips for your wellness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.values(categories).map((category) => (
            <Link
              key={category.categoryType}
              href={`/ideas/${category.categoryType}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="h-56 bg-gradient-to-br from-green-400 to-green-600 relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <h2 className="text-2xl font-bold text-white">
                      {category.categoryAbout}
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">
                    {category.shortInfo}
                  </p>
                  <span className="inline-flex items-center mt-4 text-green-600 font-medium group-hover:text-green-700">
                    Explore Ideas
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Have something to share that helped you?
          </p>
          <Link
            href="/create"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Share Your Idea
          </Link>
        </div>
      </div>
    </div>
  );
}
