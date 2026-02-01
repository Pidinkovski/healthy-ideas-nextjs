'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Idea, Comment, Like } from '@/types';
import { useAuth } from '@/components/AuthProvider';
import toast from 'react-hot-toast';

export default function IdeaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const ideaId = params.id as string;
  
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentPage, setCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchIdea = useCallback(async () => {
    try {
      const res = await fetch(`/api/ideas/${ideaId}?load=author`);
      if (!res.ok) throw new Error('Failed to fetch idea');
      const data = await res.json();
      setIdea(data);
    } catch (err) {
      toast.error('Failed to load idea');
    }
  }, [ideaId]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?ideaId=${ideaId}&page=${commentPage}&pageSize=4`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data.comments);
      setTotalCommentPages(data.totalPages);
    } catch (err) {
      toast.error('Failed to load comments');
    }
  }, [ideaId, commentPage]);

  const fetchLikes = useCallback(async () => {
    try {
      const res = await fetch(`/api/likes?ideaId=${ideaId}`);
      if (!res.ok) throw new Error('Failed to fetch likes');
      const data = await res.json();
      setLikes(data);
    } catch (err) {
      console.error('Failed to load likes');
    }
  }, [ideaId]);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchIdea(), fetchComments(), fetchLikes()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchIdea, fetchComments, fetchLikes]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like');
      return;
    }
    if (!user?.accessToken) return;

    setIsLiking(true);
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken,
        },
        body: JSON.stringify({ ideaId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to like');
      }

      await fetchLikes();
      toast.success('Liked!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }
    if (!user?.accessToken) return;
    if (newComment.trim().length < 5) {
      toast.error('Comment must be at least 5 characters');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken,
        },
        body: JSON.stringify({ ideaId, content: newComment.trim() }),
      });

      if (!res.ok) throw new Error('Failed to create comment');

      setNewComment('');
      await fetchComments();
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    if (!user?.accessToken) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'X-Authorization': user.accessToken },
      });

      if (!res.ok) throw new Error('Failed to delete comment');

      await fetchComments();
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const handleDeleteIdea = async () => {
    if (!confirm('Are you sure you want to delete this idea?')) return;
    if (!user?.accessToken) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE',
        headers: { 'X-Authorization': user.accessToken },
      });

      if (!res.ok) throw new Error('Failed to delete idea');

      toast.success('Idea deleted');
      router.push(`/ideas/${idea?.category}`);
    } catch (err) {
      toast.error('Failed to delete idea');
      setIsDeleting(false);
    }
  };

  const isLiked = likes.some((like) => like._ownerId === user?._id);
  const isOwner = idea?._ownerId === user?._id;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Idea Not Found</h1>
          <Link href="/catalog" className="text-green-600 hover:text-green-700">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href={`/ideas/${idea.category}`} className="text-green-600 hover:text-green-700 mb-4 inline-flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {idea.category}
        </Link>

        <article className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="h-64 md:h-96 bg-gray-200 relative">
            <img
              src={idea.imageUrl}
              alt={idea.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{idea.title}</h1>
                <p className="text-gray-500 mt-1">
                  by <span className="font-medium">{idea.author?.email || 'Unknown'}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                {isAuthenticated && !isOwner && (
                  <button
                    onClick={handleLike}
                    disabled={isLiking || isLiked}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                      isLiked
                        ? 'bg-red-100 text-red-600 cursor-default'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {likes.length}
                  </button>
                )}

                {isOwner && (
                  <div className="flex gap-2">
                    <Link
                      href={`/idea/${ideaId}/edit`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={handleDeleteIdea}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{idea.description}</p>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Comments ({likes.length} likes)
          </h2>

          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment._id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{comment.email}</p>
                    <p className="text-gray-600 mt-1">{comment.content}</p>
                  </div>
                  {comment._ownerId === user?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalCommentPages > 1 && (
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setCommentPage((p) => Math.max(1, p - 1))}
                disabled={commentPage <= 1}
                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                {commentPage} / {totalCommentPages}
              </span>
              <button
                onClick={() => setCommentPage((p) => Math.min(totalCommentPages, p + 1))}
                disabled={commentPage >= totalCommentPages}
                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {isAuthenticated && !isOwner && (
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                minLength={5}
              />
              <button
                type="submit"
                disabled={isSubmittingComment || newComment.trim().length < 5}
                className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
