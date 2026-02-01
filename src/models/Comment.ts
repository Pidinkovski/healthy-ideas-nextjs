import mongoose from 'mongoose';

export interface IComment {
  content: string;
  ideaId: mongoose.Types.ObjectId;
  email: string;
  _ownerId: mongoose.Types.ObjectId;
  _createdOn: Date;
}

const CommentSchema = new mongoose.Schema<IComment>({
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [5, 'Comment must be at least 5 characters'],
    trim: true,
  },
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true,
  },
  email: {
    type: String,
    required: true,
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

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
