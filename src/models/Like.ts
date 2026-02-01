import mongoose from 'mongoose';

export interface ILike {
  ideaId: mongoose.Types.ObjectId;
  _ownerId: mongoose.Types.ObjectId;
  _createdOn: Date;
}

const LikeSchema = new mongoose.Schema<ILike>({
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
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

LikeSchema.index({ ideaId: 1, _ownerId: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);
