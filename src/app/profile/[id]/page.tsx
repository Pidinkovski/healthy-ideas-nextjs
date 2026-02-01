'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Profile, Idea } from '@/types';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const userId = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isOwnProfile = user?._id === userId;

  useEffect(() => {
    fetchProfile();
    fetchUserIdeas();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profiles?_ownerId=${userId}`);
      if (!res.ok) {
        if (isOwnProfile) {
          window.location.href = '/create-profile';
          return;
        }
        throw new Error('Profile not found');
      }
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  const fetchUserIdeas = async () => {
    try {
      const res = await fetch(`/api/ideas?load=author`);
      if (!res.ok) throw new Error('Failed to fetch ideas');
      const data = await res.json();
      setIdeas(data.filter((idea: Idea) => idea._ownerId === userId));
    } catch (err) {
      console.error('Failed to load ideas');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          {isOwnProfile && (
            <Link href="/create-profile" className="text-green-600 hover:text-green-700">
              Create your profile
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-green-400 to-green-600"></div>
          <div className="px-6 pb-6">
            <div className="relative flex justify-between items-end -mt-12 mb-4">
              <img
                src={profile.profilePicture}
                alt={profile.username}
                className="w-24 h-24 rounded-full border-4 border-white object-cover bg-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-avatar.jpg';
                }}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
              <p className="text-gray-500">{profile.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                {profile.gender}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Years of Practice</p>
                <p className="text-xl font-bold text-gray-900">{profile.years}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Ideas Shared</p>
                <p className="text-xl font-bold text-gray-900">{ideas.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Date(profile._createdOn).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
              <p className="text-gray-700">{profile.bio}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">More</h3>
              <p className="text-gray-700">{profile.more}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isOwnProfile ? 'My Ideas' : `${profile.username}'s Ideas`}
          </h2>

          {ideas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No ideas shared yet.
              {isOwnProfile && (
                <Link href="/create" className="text-green-600 hover:text-green-700 ml-1">
                  Create your first idea
                </Link>
              )}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas.map((idea) => (
                <Link key={idea._id} href={`/idea/${idea._id}`}>
                  <div className="border rounded-lg p-4 hover:shadow-sm transition">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{idea.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 capitalize">{idea.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
