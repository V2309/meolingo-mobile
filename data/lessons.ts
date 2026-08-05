import { Lesson } from "@/types/learning";

export const lessons: Lesson[] = [
  // Spanish Unit 1 Lessons
  {
    id: "es-lesson-1",
    unitId: "es-unit-3",
    title: "Greetings & Introductions",
    description: "Learn basic greetings and introducing yourself with your virtual AI teacher.",
    type: "video-ai-teacher",
    order: 1,
    xpReward: 20,
    goals: [
      "Say hello ('Hola')",
      "Introduce yourself ('Me llamo...')"
    ],
    aiPrompt: "You are Lucía, a friendly native Spanish teacher. Guide the user through their first conversation.",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-talking-to-camera-in-interview-41372-large.mp4",
    vocabulary: [
      {
        id: "vocab-es-1",
        word: "Hola",
        translation: "Hello",
        pronunciation: "OH-lah",
        partOfSpeech: "interjection",
        exampleSentence: "Hola, ¿cómo estás?",
        exampleTranslation: "Hello, how are you?"
      }
    ],
    activities: [
      {
        id: "es-act-1-1",
        type: "multiple-choice",
        question: "How do you say 'Hello' in Spanish?",
        options: ["Adiós", "Hola", "Gracias", "Por favor"],
        correctAnswer: "Hola"
      }
    ]
  },
  {
    id: "es-lesson-2",
    unitId: "es-unit-3",
    title: "Daily Life",
    description: "Practice listening and speaking common conversational phrases.",
    type: "audio-lesson",
    order: 2,
    xpReward: 15,
    goals: [
      "Ask how someone is doing ('¿Cómo estás?')",
      "Express basic feelings ('Bien, gracias')"
    ],
    activities: []
  },
  {
    id: "es-lesson-3",
    unitId: "es-unit-3",
    title: "At the Café",
    description: "Have a real-time roleplay text-chat with an AI friend.",
    type: "chat-ai-tutor",
    order: 3,
    xpReward: 25,
    goals: [
      "Order a coffee",
      "Pay at a cafe"
    ],
    activities: []
  },
  {
    id: "es-lesson-4",
    unitId: "es-unit-3",
    title: "Travel & Directions",
    description: "Learn how to ask for directions and navigate around town.",
    type: "audio-lesson",
    order: 4,
    xpReward: 20,
    goals: ["Ask where things are"],
    activities: []
  },
  {
    id: "es-lesson-5",
    unitId: "es-unit-3",
    title: "Shopping",
    description: "Learn vocabulary for buying clothes and groceries.",
    type: "vocabulary-review",
    order: 5,
    xpReward: 15,
    goals: ["Ask for prices"],
    activities: []
  },
  {
    id: "es-lesson-6",
    unitId: "es-unit-3",
    title: "Family & Friends",
    description: "Talk about your family members and loved ones.",
    type: "audio-lesson",
    order: 6,
    xpReward: 20,
    goals: ["Describe family members"],
    activities: []
  },

  // French Unit 1 Lessons
  {
    id: "fr-lesson-1",
    unitId: "fr-unit-3",
    title: "Greetings & Introductions",
    description: "Learn basic French greetings and self-introductions.",
    type: "video-ai-teacher",
    order: 1,
    xpReward: 20,
    goals: ["Say hello ('Bonjour')"],
    activities: []
  },
  {
    id: "fr-lesson-2",
    unitId: "fr-unit-3",
    title: "Daily Life",
    description: "Everyday expressions in French.",
    type: "audio-lesson",
    order: 2,
    xpReward: 15,
    goals: ["Basic daily conversations"],
    activities: []
  },
  {
    id: "fr-lesson-3",
    unitId: "fr-unit-3",
    title: "At the Café",
    description: "Order croissants and coffee in Paris.",
    type: "chat-ai-tutor",
    order: 3,
    xpReward: 25,
    goals: ["Order food and drinks"],
    activities: []
  },
  {
    id: "fr-lesson-4",
    unitId: "fr-unit-3",
    title: "Travel & Directions",
    description: "Asking for help in French cities.",
    type: "audio-lesson",
    order: 4,
    xpReward: 20,
    goals: ["Find locations"],
    activities: []
  },
  {
    id: "fr-lesson-5",
    unitId: "fr-unit-3",
    title: "Shopping",
    description: "French market vocabulary.",
    type: "vocabulary-review",
    order: 5,
    xpReward: 15,
    goals: ["Shop at markets"],
    activities: []
  },
  {
    id: "fr-lesson-6",
    unitId: "fr-unit-3",
    title: "Family & Friends",
    description: "Describing your friends and family.",
    type: "audio-lesson",
    order: 6,
    xpReward: 20,
    goals: ["Talk about family"],
    activities: []
  },

  // Japanese Unit 1 Lessons
  {
    id: "ja-lesson-1",
    unitId: "ja-unit-3",
    title: "Greetings & Introductions",
    description: "Begin your Japanese journey with greetings.",
    type: "video-ai-teacher",
    order: 1,
    xpReward: 20,
    goals: ["Say Konnichiwa"],
    activities: []
  },
  {
    id: "ja-lesson-2",
    unitId: "ja-unit-3",
    title: "Daily Life",
    description: "Daily expressions in Japanese.",
    type: "audio-lesson",
    order: 2,
    xpReward: 15,
    goals: ["Common greetings"],
    activities: []
  },
  {
    id: "ja-lesson-3",
    unitId: "ja-unit-3",
    title: "At the Café",
    description: "Order matcha latte and tea.",
    type: "chat-ai-tutor",
    order: 3,
    xpReward: 25,
    goals: ["Order at cafe"],
    activities: []
  },
  {
    id: "ja-lesson-4",
    unitId: "ja-unit-3",
    title: "Travel & Directions",
    description: "Navigating Japanese trains and streets.",
    type: "audio-lesson",
    order: 4,
    xpReward: 20,
    goals: ["Ask directions"],
    activities: []
  },
  {
    id: "ja-lesson-5",
    unitId: "ja-unit-3",
    title: "Shopping",
    description: "Buying souvenirs and snacks.",
    type: "vocabulary-review",
    order: 5,
    xpReward: 15,
    goals: ["Ask prices"],
    activities: []
  },
  {
    id: "ja-lesson-6",
    unitId: "ja-unit-3",
    title: "Family & Friends",
    description: "Talking about people.",
    type: "audio-lesson",
    order: 6,
    xpReward: 20,
    goals: ["Talk about people"],
    activities: []
  },

  // Korean Unit 1 Lessons
  {
    id: "ko-lesson-1",
    unitId: "ko-unit-3",
    title: "Introducing Hangul",
    description: "Learn the fundamentals of Hangul consonants and vowels with your AI teacher.",
    type: "video-ai-teacher",
    order: 1,
    xpReward: 20,
    goals: ["Read basic characters", "Say 'Hello' ('Annyeonghaseyo')"],
    activities: []
  },
  {
    id: "ko-lesson-2",
    unitId: "ko-unit-3",
    title: "Daily Greetings",
    description: "Learn polite daily expressions and bow customs.",
    type: "audio-lesson",
    order: 2,
    xpReward: 15,
    goals: ["Say 'Thank you' ('Gamsahabnida')", "Polite goodbyes"],
    activities: []
  },
  {
    id: "ko-lesson-3",
    unitId: "ko-unit-3",
    title: "Ordering K-BBQ",
    description: "Interactive chat with an AI friend ordering delicious Korean barbecue.",
    type: "chat-ai-tutor",
    order: 3,
    xpReward: 25,
    goals: ["Order meat dishes", "Ask for side dishes (Banchan)"],
    activities: []
  },
  {
    id: "ko-lesson-4",
    unitId: "ko-unit-3",
    title: "Around Seoul",
    description: "Learn to ask for directions to popular subway stations and cafes.",
    type: "audio-lesson",
    order: 4,
    xpReward: 20,
    goals: ["Ask for the restroom", "Locate the subway"],
    activities: []
  },
  {
    id: "ko-lesson-5",
    unitId: "ko-unit-3",
    title: "K-Pop Vocabulary",
    description: "Review common words found in K-Pop songs and K-Dramas.",
    type: "vocabulary-review",
    order: 5,
    xpReward: 15,
    goals: ["Understand key drama terms", "Master basic verbs"],
    activities: []
  },

  // Chinese Unit 1 Lessons
  {
    id: "zh-lesson-1",
    unitId: "zh-unit-3",
    title: "Tones & Pinyin",
    description: "Learn the 4 tones and the Pinyin Romanization system.",
    type: "video-ai-teacher",
    order: 1,
    xpReward: 20,
    goals: ["Identify the four tones", "Say 'Hello' ('Nǐ hǎo')"],
    activities: []
  },
  {
    id: "zh-lesson-2",
    unitId: "zh-unit-3",
    title: "Numbers & Counting",
    description: "Learn to count from 1 to 10 and basic hand gestures.",
    type: "audio-lesson",
    order: 2,
    xpReward: 15,
    goals: ["Count to ten", "Say phone numbers"],
    activities: []
  },
  {
    id: "zh-lesson-3",
    unitId: "zh-unit-3",
    title: "At the Tea House",
    description: "Practice ordering different types of Chinese tea with an AI host.",
    type: "chat-ai-tutor",
    order: 3,
    xpReward: 25,
    goals: ["Order green/black tea", "Ask for the check"],
    activities: []
  },
  {
    id: "zh-lesson-4",
    unitId: "zh-unit-3",
    title: "Asking for Help",
    description: "Crucial travel vocabulary for navigation and help.",
    type: "audio-lesson",
    order: 4,
    xpReward: 20,
    goals: ["Ask 'Where is...?'", "Request simple assistance"],
    activities: []
  },
  {
    id: "zh-lesson-5",
    unitId: "zh-unit-3",
    title: "Market Shopping",
    description: "Learn how to ask for prices and bargain politely.",
    type: "vocabulary-review",
    order: 5,
    xpReward: 15,
    goals: ["Ask 'How much?' ('Duōshǎo qián?')", "Bargain phrases"],
    activities: []
  }
];

