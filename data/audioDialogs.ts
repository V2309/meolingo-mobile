export interface DialogTurn {
  teacherOriginal: string;
  teacherTranslation: string;
  userPrompt: string;
  expectedResponse: string;
  feedback: {
    speaking: string;
    pronunciation: string;
    grammar: string;
  };
}

export const DIALOG_SCRIPTS: Record<string, DialogTurn[]> = {
  es: [
    {
      teacherOriginal: "¡Hola! Bienvenido a tu lección de audio. ¿Cómo estás?",
      teacherTranslation: "Hello! Welcome to your audio lesson. How are you?",
      userPrompt: "Say 'I am doing well, thank you' in Spanish",
      expectedResponse: "Estoy bien, gracias.",
      feedback: { speaking: "Excellent", pronunciation: "Great", grammar: "Good" }
    },
    {
      teacherOriginal: "¡Muy bien! ¿Y tú? Practiquemos hablar de tu rutina diaria.",
      teacherTranslation: "Very well! And you? Let's practice talking about your daily routine.",
      userPrompt: "Say 'I drink coffee in the morning' in Spanish",
      expectedResponse: "Tomo café por la mañana.",
      feedback: { speaking: "Excellent", pronunciation: "Excellent", grammar: "Great" }
    },
    {
      teacherOriginal: "¡Excelente trabajo! Eso suena delicioso. ¿Qué haces después?",
      teacherTranslation: "Excellent work! That sounds delicious. What do you do next?",
      userPrompt: "Say 'I work' or 'I study' in Spanish",
      expectedResponse: "Yo trabajo.",
      feedback: { speaking: "Great", pronunciation: "Great", grammar: "Excellent" }
    }
  ],
  fr: [
    {
      teacherOriginal: "Bonjour! Bienvenue dans votre leçon audio. Comment ça va ?",
      teacherTranslation: "Hello! Welcome to your audio lesson. How is it going?",
      userPrompt: "Say 'It is going well, thank you' in French",
      expectedResponse: "Ça va bien, merci.",
      feedback: { speaking: "Excellent", pronunciation: "Great", grammar: "Good" }
    },
    {
      teacherOriginal: "Très bien! Et toi? Parlons de votre vie quotidienne.",
      teacherTranslation: "Very well! And you? Let's talk about your daily life.",
      userPrompt: "Say 'I read a book' in French",
      expectedResponse: "Je lis un livre.",
      feedback: { speaking: "Excellent", pronunciation: "Excellent", grammar: "Great" }
    }
  ],
  ja: [
    {
      teacherOriginal: "こんにちは！オーディオレッスンへようこそ。お元気ですか？",
      teacherTranslation: "Hello! Welcome to the audio lesson. How are you?",
      userPrompt: "Say 'I am fine' in Japanese",
      expectedResponse: "元気です。",
      feedback: { speaking: "Excellent", pronunciation: "Great", grammar: "Good" }
    },
    {
      teacherOriginal: "素晴らしいですね！毎日の生活について話しましょう。",
      teacherTranslation: "Wonderful! Let's talk about daily life.",
      userPrompt: "Say 'I eat breakfast' in Japanese",
      expectedResponse: "朝ごはんを食べます。",
      feedback: { speaking: "Excellent", pronunciation: "Excellent", grammar: "Great" }
    }
  ],
  ko: [
    {
      teacherOriginal: "안녕하세요! 오디오 레슨에 오신 것을 환영합니다. 어떻게 지내세요?",
      teacherTranslation: "Hello! Welcome to the audio lesson. How are you doing?",
      userPrompt: "Say 'I am doing well' in Korean",
      expectedResponse: "잘 지내요.",
      feedback: { speaking: "Excellent", pronunciation: "Great", grammar: "Good" }
    },
    {
      teacherOriginal: "아주 좋아요! 오늘 하루는 어떠셨나요?",
      teacherTranslation: "Very good! How was your day today?",
      userPrompt: "Say 'I met a friend' in Korean",
      expectedResponse: "친구를 만났어요.",
      feedback: { speaking: "Excellent", pronunciation: "Excellent", grammar: "Great" }
    }
  ],
  zh: [
    {
      teacherOriginal: "你好！欢迎来到语音课程。你今天怎么样？",
      teacherTranslation: "Hello! Welcome to the audio lesson. How are you today?",
      userPrompt: "Say 'I am very good' in Chinese",
      expectedResponse: "我很好。",
      feedback: { speaking: "Excellent", pronunciation: "Great", grammar: "Good" }
    },
    {
      teacherOriginal: "太棒了！我们来练习一下日常对话。",
      teacherTranslation: "Wonderful! Let's practice daily conversations.",
      userPrompt: "Say 'I drink tea' in Chinese",
      expectedResponse: "我喝茶。",
      feedback: { speaking: "Excellent", pronunciation: "Excellent", grammar: "Great" }
    }
  ]
};
