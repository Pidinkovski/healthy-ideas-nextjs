'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Idea, Category } from '@/types';
import { categories } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function CategoryIdeasPage() {
  const params = useParams();
  const categoryType = params.category as string;
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const category = categories[categoryType as keyof typeof categories];

  useEffect(() => {
    fetchIdeas();
  }, [categoryType]);

  const fetchIdeas = async () => {
    try {
      const res = await fetch(`/api/ideas?category=${categoryType}&load=author`);
      if (!res.ok) throw new Error('Failed to fetch ideas');
      const data = await res.json();
      setIdeas(data);
    } catch (err) {
      toast.error('Failed to load ideas');
    } finally {
      setIsLoading(false);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
          <Link href="/catalog" className="text-green-600 hover:text-green-700">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/catalog" className="text-green-600 hover:text-green-700 mb-4 inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Catalog
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{category.categoryAbout} Ideas</h1>
          <p className="text-gray-600 mt-2">{category.shortInfo}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-600 mb-4">No ideas yet in this category.</p>
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Be the first to share
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <Link key={idea._id} href={`/idea/${idea._id}`}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={idea.imageUrl}
                      alt={idea.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{idea.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{idea.conciseContent}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      by {idea.author?.email || 'Unknown'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
