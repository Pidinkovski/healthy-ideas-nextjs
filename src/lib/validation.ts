import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ideaSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be at most 100 characters'),
  imageUrl: z.string().url('Invalid image URL'),
  description: z.string().min(30, 'Description must be at least 30 characters'),
  conciseContent: z.string().min(10, 'Concise content must be at least 10 characters').max(30, 'Concise content must be at most 30 characters'),
  category: z.enum(['workout', 'lifestyle', 'food', 'mindful'], {
    message: 'Please select a valid category',
  }),
});

export const commentSchema = z.object({
  content: z.string().min(5, 'Comment must be at least 5 characters'),
  ideaId: z.string(),
});

export const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  profilePicture: z.string().url('Invalid image URL'),
  gender: z.enum(['male', 'female'], {
    message: 'Please select a gender',
  }),
  bio: z.string().min(1, 'Bio is required'),
  years: z.number().min(0, 'Years must be at least 0'),
  more: z.string().min(1, 'More info is required'),
});
