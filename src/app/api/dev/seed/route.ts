import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Idea, User } from '@/models';

// One-time seed endpoint to populate initial ideas
// Call once, then optionally delete or protect this route.
// Usage: POST /api/dev/seed

export async function POST(_request: NextRequest) {
  try {
    await connectDB();

    const existingCount = await Idea.countDocuments();

    if (existingCount > 0) {
      return NextResponse.json(
        { message: 'Seed skipped: ideas collection is not empty', existingCount },
        { status: 200 }
      );
    }

    // Create/find a demo owner to satisfy schema requirements
    const demoEmail = 'demo@healthyideas.local';
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      demoUser = await User.create({
        email: demoEmail,
        password: `Demo-${Math.random().toString(36).slice(2)}-${Date.now()}`,
      });
    }

    const now = new Date();

    const seedIdeas = [
      // WORKOUT
      {
        title: 'Beginner Full-Body Home Workout (No Equipment)',
        imageUrl: '/images/workout.jpg',
        description:
          'A simple full-body routine you can do at home 3 times per week. Focus on controlled tempo, good form, and consistency instead of intensity. Start with 2 sets of 10-12 reps per exercise and add reps or a third set only when it feels easy. Always warm up for 5 minutes (joint rotations + light marching in place) and finish with gentle stretching.',
        conciseContent:
          'Simple 3x/week home routine for beginners, no equipment needed.',
        category: 'workout',
      },
      {
        title: '30-Minute HIIT Routine for Busy Days',
        imageUrl: '/images/workout.jpg',
        description:
          'A 30-minute high-intensity interval training (HIIT) session for people with limited time. Work blocks of 30–40 seconds followed by 20–30 seconds rest. Choose 4–6 exercises that hit large muscle groups (squats, lunges, push-ups, mountain climbers). Do 3–4 rounds. Keep at least one rest day after intense HIIT to protect joints and avoid burnout.',
        conciseContent: 'Quick 30-min HIIT session for when your schedule is packed.',
        category: 'workout',
      },

      // LIFESTYLE
      {
        title: 'Evening Routine for Better Sleep Quality',
        imageUrl: '/images/lifestyle.jpg',
        description:
          'A gentle evening routine that helps your nervous system switch from "work mode" to recovery. 60–90 minutes before bed, dim the lights and reduce screens. Do a short walk or stretching, write down tomorrow\'s 3 priorities on paper, and avoid caffeine after 15:00. Try to keep a consistent sleep window (for example 23:00–07:00) even on weekends.',
        conciseContent:
          'Simple evening habits that help you fall asleep faster and wake up rested.',
        category: 'lifestyle',
      },
      {
        title: 'Daily Structure for More Stable Energy',
        imageUrl: '/images/lifestyle.jpg',
        description:
          'Instead of random days, think in blocks: focus block (90–120 minutes of deep work), movement block (10–20 minutes walk or light exercise), admin block (messages, email, chores), and recovery block (time without screens, hobbies, social connection). Rotating these blocks through the day keeps stress lower, energy more stable, and reduces the feeling of being "always behind".',
        conciseContent:
          'Use simple focus, movement, admin, and recovery blocks to structure your day.',
        category: 'lifestyle',
      },

      // FOOD
      {
        title: 'High-Protein Breakfast Bowl (5 Minutes)',
        imageUrl: '/images/food.jpg',
        description:
          'Base: Greek yogurt or skyr + a handful of oats. Add a source of fruit (berries or banana), some healthy fats (nuts or seeds), and a pinch of cinnamon. This combination gives a solid amount of protein, fiber, and slow carbohydrates, which reduces mid-morning cravings and keeps focus more stable. Adjust portion size based on your hunger and activity level.',
        conciseContent:
          'Fast breakfast with protein, fiber and healthy fats to reduce cravings.',
        category: 'food',
      },
      {
        title: '3-Day Simple Meal Prep for Busy Weeks',
        imageUrl: '/images/food.jpg',
        description:
          'Cook once, eat multiple times. Pick one protein (chicken, tofu, beans), one carb source (rice, potatoes, quinoa), and 2–3 vegetables. Season differently for each container so meals do not feel identical (for example: Mexican-style, Mediterranean, and curry). This reduces decision fatigue and makes it much easier to stay on track during stressful days.',
        conciseContent:
          'Cook once and mix protein, carbs, and veggies into 3 days of easy meals.',
        category: 'food',
      },

      // MINDFUL
      {
        title: '5-Minute Morning Mindfulness Check-In',
        imageUrl: '/images/mindful.jpg',
        description:
          'Before looking at your phone, sit comfortably and notice 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, and 1 you can taste. Then take 5 slow breaths, exhale slightly longer than you inhale. This simple habit calms the nervous system and makes it less likely that the whole day is driven only by notifications and stress.',
        conciseContent:
          'Short sensory and breathing practice to start the day more grounded.',
        category: 'mindful',
      },
      {
        title: 'Box Breathing Technique for Stressful Moments',
        imageUrl: '/images/mindful.jpg',
        description:
          'Box breathing (4–4–4–4) is a simple tool used in high-stress environments. Inhale through the nose for 4 seconds, hold for 4, exhale for 4, hold empty for 4. Repeat for 1–3 minutes. It slows the heart rate and shifts your body towards a calmer state, which helps with decision-making and reduces impulsive reactions.',
        conciseContent:
          'Use 4–4–4–4 breathing to quickly reduce stress and regain control.',
        category: 'mindful',
      },
    ].map((idea) => ({
      ...idea,
      _createdOn: now,
      _ownerId: demoUser!._id,
    }));

    await Idea.insertMany(seedIdeas);

    return NextResponse.json(
      { message: 'Seed completed', inserted: seedIdeas.length },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
