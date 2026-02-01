import mongoose from 'mongoose';

export interface IIdea {
  title: string;
  imageUrl: string;
  description: string;
  conciseContent: string;
  category: 'workout' | 'lifestyle' | 'food' | 'mindful';
  _ownerId: mongoose.Types.ObjectId;
  _createdOn: Date;
}

const IdeaSchema = new mongoose.Schema<IIdea>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title must be at most 100 characters'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [30, 'Description must be at least 30 characters'],
  },
  conciseContent: {
    type: String,
    required: [true, 'Concise content is required'],
    minlength: [10, 'Concise content must be at least 10 characters'],
    maxlength: [30, 'Concise content must be at most 30 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['workout', 'lifestyle', 'food', 'mindful'],
  },
  _ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  _createdOn: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Idea || mongoose.model<IIdea>('Idea', IdeaSchema);
