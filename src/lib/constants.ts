export const categories = {
  workout: {
    categoryType: 'workout',
    categoryAbout: 'Workout',
    imageUrl: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg',
    shortInfo: 'Effective and fast workouts to do at home. Programs suitable for beginners and advanced users.',
  },
  lifestyle: {
    categoryType: 'lifestyle',
    categoryAbout: 'Lifestyle',
    imageUrl: 'https://images.pexels.com/photos/373882/pexels-photo-373882.jpeg',
    shortInfo: 'Habits and routines that improve sleep, stress, and daily energy levels.',
  },
  food: {
    categoryType: 'food',
    categoryAbout: 'Food',
    imageUrl: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg',
    shortInfo: 'Simple, realistic recipes that support a healthy lifestyle without perfectionism.',
  },
  mindful: {
    categoryType: 'mindful',
    categoryAbout: 'Mindful Set',
    imageUrl: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg',
    shortInfo: 'Mindfulness, breathing and mental tools to connect body and mind.',
  },
} as const;

export type CategoryType = keyof typeof categories;
