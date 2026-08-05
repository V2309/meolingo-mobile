export interface Language {
  id: string; // e.g., 'es' for Spanish, 'fr' for French, 'ja' for Japanese
  name: string; // e.g., 'Spanish'
  nativeName: string; // e.g., 'Español'
  flagEmoji: string; // e.g., '🇪🇸'
  accentColor: string; // Tailwind hex or design system color, e.g., '#FF5F5F'
  isActive: boolean; // Is it available/enabled for learners
  learnersCount?: string; // e.g., '28.4M learners'
}

export interface Unit {
  id: string; // e.g., 'es-unit-1'
  languageId: string; // Matches Language.id
  title: string; // e.g., 'Greetings and Basics'
  description: string; // e.g., 'Learn to say hello, introduce yourself, and ask simple questions.'
  order: number; // For sorting units
}

export type LessonType = 'video-ai-teacher' | 'audio-lesson' | 'chat-ai-tutor' | 'vocabulary-review';

export interface VocabularyItem {
  id: string; // e.g., 'vocab-es-hola'
  word: string; // e.g., 'Hola'
  translation: string; // e.g., 'Hello'
  pronunciation?: string; // e.g., 'OH-lah'
  partOfSpeech?: string; // e.g., 'interjection'
  exampleSentence?: string; // e.g., 'Hola, ¿cómo estás?'
  exampleTranslation?: string; // e.g., 'Hello, how are you?'
}

export interface PhraseItem {
  id: string; // e.g., 'phrase-es-1'
  original: string; // e.g., '¡Hola! ¿Cómo te llamas?'
  translated: string; // e.g., 'Hello! What is your name?'
  context?: string; // context or hint
}

export type ActivityType = 
  | 'multiple-choice' 
  | 'translate' 
  | 'matching' 
  | 'listening' 
  | 'speaking' 
  | 'fill-in-blank';

export interface Activity {
  id: string;
  type: ActivityType;
  question: string;
  options?: string[]; // Multiple choice options, matching left items, etc.
  matchingPairs?: { left: string; right: string }[]; // For matching activities specifically
  correctAnswer: string | string[]; // Correct choice(s) or standard translation or comma-separated pairs
  audioUrl?: string; // Optional audio file for listening/speaking prompts
  promptContext?: string; // Hint or secondary text (e.g. "Translate this sentence")
}

export interface Lesson {
  id: string; // e.g., 'es-lesson-1'
  unitId: string; // Matches Unit.id
  title: string; // e.g., 'Meeting People'
  description: string; // e.g., 'Learn how to introduce yourself.'
  type: LessonType;
  order: number; // For sorting lessons within a unit
  xpReward: number; // e.g., 20
  goals: string[]; // e.g., ['Say hello', 'Introduce yourself']
  aiPrompt?: string; // Prompt for the future audio-based/video-based AI Teacher / Vision Agent session
  mediaUrl?: string; // e.g., static video/audio asset URL or local require reference
  vocabulary?: VocabularyItem[];
  phrases?: PhraseItem[];
  activities: Activity[];
}
