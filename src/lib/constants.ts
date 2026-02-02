export const categories = {
  workout: {
    categoryType: 'workout',
    categoryAbout: 'Workout',
    imageUrl: '/images/workout.jpg',
    shortInfo: 'Effective and fast workouts to do at home. Programs suitable for beginners and advanced users.',
  },
  lifestyle: {
    categoryType: 'lifestyle',
    categoryAbout: 'Lifestyle',
    imageUrl: '/images/lifestyle.jpg',
    shortInfo: 'Habits and routines that improve sleep, stress, and daily energy levels.',
  },
  food: {
    categoryType: 'food',
    categoryAbout: 'Food',
    imageUrl: '/images/food.jpg',
    shortInfo: 'Simple, realistic recipes that support a healthy lifestyle without perfectionism.',
  },
  mindful: {
    categoryType: 'mindful',
    categoryAbout: 'Mindful Set',
    imageUrl: '/images/mindful.jpg',
    shortInfo: 'Mindfulness, breathing and mental tools to connect body and mind.',
  },
} as const;

export type CategoryType = keyof typeof categories;
