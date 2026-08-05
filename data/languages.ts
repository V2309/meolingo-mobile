import { Language } from "@/types/learning";

export const languages: Language[] = [
  {
    id: "es",
    name: "Spanish",
    nativeName: "Español",
    flagEmoji: "https://flagcdn.com/w320/es.png",
    accentColor: "#FF5F5F", // Warm primary orange-red
    isActive: true,
    learnersCount: "28.4M learners",
  },
  {
    id: "fr",
    name: "French",
    nativeName: "Français",
    flagEmoji: "https://flagcdn.com/w320/fr.png",
    accentColor: "#4B9FE1", // Classic French blue
    isActive: true,
    learnersCount: "19.4M learners",
  },
  {
    id: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flagEmoji: "https://flagcdn.com/w320/jp.png",
    accentColor: "#E25C84", // Cherry blossom pink
    isActive: true,
    learnersCount: "12.7M learners",
  },
  {
    id: "ko",
    name: "Korean",
    nativeName: "한국어",
    flagEmoji: "https://flagcdn.com/w320/kr.png",
    accentColor: "#31B057", // Vibrant green
    isActive: true,
    learnersCount: "9.3M learners",
  },
  {
    id: "de",
    name: "German",
    nativeName: "Deutsch",
    flagEmoji: "https://flagcdn.com/w320/de.png",
    accentColor: "#F1B743", // Gold/yellow
    isActive: false, // Coming soon
    learnersCount: "8.1M learners",
  },
  {
    id: "zh",
    name: "Chinese",
    nativeName: "中文",
    flagEmoji: "https://flagcdn.com/w320/cn.png",
    accentColor: "#F43F5E", // Crimson rose
    isActive: true,
    learnersCount: "7.4M learners",
  },
];
