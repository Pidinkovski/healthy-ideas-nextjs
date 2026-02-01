export const categories = {
  workout: {
    categoryType: 'workout',
    categoryAbout: 'Workout',
    imageUrl: '/images/categoryWorkout.jpg',
    shortInfo: 'Effective and fast workouts to do at home. There will be as for all levels beginners to advance.',
  },
  lifestyle: {
    categoryType: 'lifestyle',
    categoryAbout: 'Lifestyle',
    imageUrl: '/images/healthyLifeStyle.jpg',
    shortInfo: 'Here you can find what you can change in daily routines and habits, to feel better.',
  },
  food: {
    categoryType: 'food',
    categoryAbout: 'Food',
    imageUrl: '/images/healthyFood.jpg',
    shortInfo: 'You will find easy, healthy and simple recipes to try at home, and to adjust to your diet.',
  },
  mindful: {
    categoryType: 'mindful',
    categoryAbout: 'Mindful Set',
    imageUrl: '/images/mindfulSet.png',
    shortInfo: 'You will find tips about how to create a better connection between mind and body, how to meditate, how to do manifestations etc...',
  },
} as const;

export type CategoryType = keyof typeof categories;
