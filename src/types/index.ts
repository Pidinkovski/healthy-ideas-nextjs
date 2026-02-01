export interface User {
  _id: string;
  email: string;
  accessToken?: string;
  _createdOn: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Category {
  categoryType: string;
  categoryAbout: string;
  imageUrl: string;
  shortInfo: string;
}

export interface Idea {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
  conciseContent: string;
  category: string;
  _ownerId: string;
  author?: User;
  _createdOn: string;
}

export interface Comment {
  _id: string;
  content: string;
  ideaId: string;
  email: string;
  _ownerId: string;
  _createdOn: string;
}

export interface Like {
  _id: string;
  ideaId: string;
  _ownerId: string;
  _createdOn: string;
}

export interface Profile {
  _id: string;
  username: string;
  profilePicture: string;
  gender: 'male' | 'female';
  bio: string;
  years: number;
  more: string;
  email: string;
  _ownerId: string;
  _createdOn: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
