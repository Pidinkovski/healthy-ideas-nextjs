import mongoose from 'mongoose';

export interface IProfile {
  username: string;
  profilePicture: string;
  gender: 'male' | 'female';
  bio: string;
  years: number;
  more: string;
  email: string;
  _ownerId: mongoose.Types.ObjectId;
  _createdOn: Date;
}

const ProfileSchema = new mongoose.Schema<IProfile>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [2, 'Username must be at least 2 characters'],
  },
  profilePicture: {
    type: String,
    required: [true, 'Profile picture is required'],
    trim: true,
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female'],
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true,
  },
  years: {
    type: Number,
    required: [true, 'Years of practice is required'],
    min: [0, 'Years must be at least 0'],
  },
  more: {
    type: String,
    required: [true, 'More info is required'],
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  _ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  _createdOn: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
