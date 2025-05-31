
// import { create } from 'zustand';
// import { QuizQuestion, QuizResult } from '@/types';

// interface QuizState {
//   questions: QuizQuestion[];
//   results: QuizResult[];
//   submitQuizResult: (staffId: string, answers: number[]) => void;
// }

// const mockQuestions: QuizQuestion[] = [
//   {
//     id: 'q1',
//     question: 'What color container should be used for infectious waste?',
//     options: ['Red', 'Yellow', 'Blue', 'Green'],
//     correctAnswer: 0,
//     explanation: 'Red containers are specifically designated for infectious waste to ensure proper handling and disposal.'
//   },
//   {
//     id: 'q2',
//     question: 'How full can a biohazard bin be before it needs pickup?',
//     options: ['100%', '90%', '80%', '75%'],
//     correctAnswer: 2,
//     explanation: 'Biohazard bins should not exceed 80% capacity to prevent overflow and maintain safety standards.'
//   },
//   {
//     id: 'q3',
//     question: 'Which waste type requires the most stringent disposal protocols?',
//     options: ['Regular medical waste', 'Sharps', 'Chemotherapy waste', 'Paper waste'],
//     correctAnswer: 2,
//     explanation: 'Chemotherapy waste contains cytotoxic materials that require specialized handling and disposal procedures.'
//   },
//   {
//     id: 'q4',
//     question: 'How often should waste disposal areas be cleaned?',
//     options: ['Weekly', 'Daily', 'Monthly', 'When full'],
//     correctAnswer: 1,
//     explanation: 'Daily cleaning of waste disposal areas helps maintain hygiene and prevents contamination.'
//   },
//   {
//     id: 'q5',
//     question: 'What should you do if you notice a bin leaking?',
//     options: ['Continue using it', 'Report immediately', 'Clean it yourself', 'Ignore it'],
//     correctAnswer: 1,
//     explanation: 'Any leaking waste container is a safety hazard and should be reported immediately to waste management personnel.'
//   },
//   {
//     id: 'q6',
//     question: 'Which bin color is used for biodegradable waste in hospitals?',
//     options: ['Blue', 'Green', 'Yellow', 'Black'],
//     correctAnswer: 1,
//     explanation: 'Biodegradable waste like food and plant material is disposed of in the green bin.'
//   },
//   {
//     id: 'q7',
//     question: 'What type of waste should be disposed of in the green bin?',
//     options: ['Used needles and syringes', 'Leftover food and fruit peels', 'Plastic bottles and IV packaging', 'Office papers and files'],
//     correctAnswer: 1,
//     explanation: 'Green bins are designated for organic, biodegradable waste such as food scraps and plant material.'
//   },
//   {
//     id: 'q8',
//     question: 'Where should broken glass containers that are not contaminated be disposed?',
//     options: ['Yellow bin', 'Green bin', 'Blue bin', 'Red bin'],
//     correctAnswer: 2,
//     explanation: 'Non-contaminated broken glass and similar non-biodegradable waste go in the blue bin.'
//   },
//   {
//     id: 'q9',
//     question: 'Which bin color is designated for hazardous biomedical waste like used needles and blood-soaked gloves?',
//     options: ['Blue', 'Yellow (and red for sharps)', 'Black', 'Green'],
//     correctAnswer: 1,
//     explanation: 'Yellow bins are for infectious waste, while sharp objects go in red bins to prevent injuries.'
//   },
//   {
//     id: 'q10',
//     question: 'Expired medicines and cytotoxic drugs should be disposed of in which bin?',
//     options: ['Black bin', 'Yellow bin', 'Blue bin', 'Green bin'],
//     correctAnswer: 1,
//     explanation: 'Hazardous biomedical waste such as expired medicines is placed in the yellow bin.'
//   },
//   {
//     id: 'q11',
//     question: 'What type of waste belongs in the black or white bin?',
//     options: ['Non-infected cotton swabs', 'Broken chairs and office papers', 'Contaminated IV tubes', 'Fruit and vegetable peels'],
//     correctAnswer: 1,
//     explanation: 'General, non-medical waste like office materials and furniture go into black or white bins.'
//   },
//   {
//     id: 'q12',
//     question: 'Which of the following is NOT a safety guideline when handling hospital waste?',
//     options: ['Wear gloves and masks', 'Mix hazardous and general waste in the same bin', 'Report full bins immediately', 'Use color-coded bins as per protocol'],
//     correctAnswer: 1,
//     explanation: 'Mixing hazardous and general waste violates safety protocols and increases contamination risk.'
//   },
//   {
//     id: 'q13',
//     question: 'Which bin is used for sharp waste such as scalpels and needles?',
//     options: ['Yellow', 'Red', 'Blue', 'Green'],
//     correctAnswer: 1,
//     explanation: 'Sharp medical waste must go into red bins designed to safely contain items like needles and scalpels.'
//   },
//   {
//     id: 'q14',
//     question: 'What should you do if a waste bin is full or damaged?',
//     options: ['Ignore it', 'Report it immediately', 'Overfill the bin carefully', 'Mix waste with other bins'],
//     correctAnswer: 1,
//     explanation: 'Full or damaged bins should be reported immediately to avoid spillage or contamination.'
//   },
//   {
//     id: 'q15',
//     question: 'Why is it important not to mix hazardous waste with general waste?',
//     options: ['To save space', 'To prevent contamination and infection', 'To make disposal easier', 'No specific reason'],
//     correctAnswer: 1,
//     explanation: 'Mixing hazardous with general waste poses severe health and environmental risks due to cross-contamination.'
//   }
// ];
// function getRandomQuestions(allQuestions: QuizQuestion[], count: number): QuizQuestion[] {
//   const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// }

// export const useQuizStore = create<QuizState>((set, get) => ({
//   questions: mockQuestions,
//   results: [],
  
//   submitQuizResult: (staffId, answers) => {
//     const questions = get().questions;
//     const score = answers.reduce((total, answer, index) => {
//       return total + (answer === questions[index].correctAnswer ? 1 : 0);
//     }, 0);
    
//     const result: QuizResult = {
//       id: `result-${Date.now()}`,
//       staffId,
//       score,
//       totalQuestions: questions.length,
//       completedAt: new Date(),
//       answers
//     };
    
//     set((state) => ({
//       results: [...state.results, result]
//     }));
//   }
// }));



import { create } from 'zustand';
import { QuizQuestion, QuizResult } from '@/types';

interface QuizState {
  questions: QuizQuestion[];
  currentQuizQuestions: QuizQuestion[];
  results: QuizResult[];
  generateRandomQuiz: () => void;
  submitQuizResult: (staffId: string, answers: number[]) => void;
}

const mockQuestions: QuizQuestion[] = [ {
    id: 'q1',
    question: 'What color container should be used for infectious waste?',
    options: ['Red', 'Yellow', 'Blue', 'Green'],
    correctAnswer: 0,
    explanation: 'Red containers are specifically designated for infectious waste to ensure proper handling and disposal.'
  },
  {
    id: 'q2',
    question: 'How full can a biohazard bin be before it needs pickup?',
    options: ['100%', '90%', '80%', '75%'],
    correctAnswer: 2,
    explanation: 'Biohazard bins should not exceed 80% capacity to prevent overflow and maintain safety standards.'
  },
  {
    id: 'q3',
    question: 'Which waste type requires the most stringent disposal protocols?',
    options: ['Regular medical waste', 'Sharps', 'Chemotherapy waste', 'Paper waste'],
    correctAnswer: 2,
    explanation: 'Chemotherapy waste contains cytotoxic materials that require specialized handling and disposal procedures.'
  },
  {
    id: 'q4',
    question: 'How often should waste disposal areas be cleaned?',
    options: ['Weekly', 'Daily', 'Monthly', 'When full'],
    correctAnswer: 1,
    explanation: 'Daily cleaning of waste disposal areas helps maintain hygiene and prevents contamination.'
  },
  {
    id: 'q5',
    question: 'What should you do if you notice a bin leaking?',
    options: ['Continue using it', 'Report immediately', 'Clean it yourself', 'Ignore it'],
    correctAnswer: 1,
    explanation: 'Any leaking waste container is a safety hazard and should be reported immediately to waste management personnel.'
  },
  {
    id: 'q6',
    question: 'Which bin color is used for biodegradable waste in hospitals?',
    options: ['Blue', 'Green', 'Yellow', 'Black'],
    correctAnswer: 1,
    explanation: 'Biodegradable waste like food and plant material is disposed of in the green bin.'
  },
  {
    id: 'q7',
    question: 'What type of waste should be disposed of in the green bin?',
    options: ['Used needles and syringes', 'Leftover food and fruit peels', 'Plastic bottles and IV packaging', 'Office papers and files'],
    correctAnswer: 1,
    explanation: 'Green bins are designated for organic, biodegradable waste such as food scraps and plant material.'
  },
  {
    id: 'q8',
    question: 'Where should broken glass containers that are not contaminated be disposed?',
    options: ['Yellow bin', 'Green bin', 'Blue bin', 'Red bin'],
    correctAnswer: 2,
    explanation: 'Non-contaminated broken glass and similar non-biodegradable waste go in the blue bin.'
  },
  {
    id: 'q9',
    question: 'Which bin color is designated for hazardous biomedical waste like used needles and blood-soaked gloves?',
    options: ['Blue', 'Yellow (and red for sharps)', 'Black', 'Green'],
    correctAnswer: 1,
    explanation: 'Yellow bins are for infectious waste, while sharp objects go in red bins to prevent injuries.'
  },
  {
    id: 'q10',
    question: 'Expired medicines and cytotoxic drugs should be disposed of in which bin?',
    options: ['Black bin', 'Yellow bin', 'Blue bin', 'Green bin'],
    correctAnswer: 1,
    explanation: 'Hazardous biomedical waste such as expired medicines is placed in the yellow bin.'
  },
  {
    id: 'q11',
    question: 'What type of waste belongs in the black or white bin?',
    options: ['Non-infected cotton swabs', 'Broken chairs and office papers', 'Contaminated IV tubes', 'Fruit and vegetable peels'],
    correctAnswer: 1,
    explanation: 'General, non-medical waste like office materials and furniture go into black or white bins.'
  },
  {
    id: 'q12',
    question: 'Which of the following is NOT a safety guideline when handling hospital waste?',
    options: ['Wear gloves and masks', 'Mix hazardous and general waste in the same bin', 'Report full bins immediately', 'Use color-coded bins as per protocol'],
    correctAnswer: 1,
    explanation: 'Mixing hazardous and general waste violates safety protocols and increases contamination risk.'
  },
  {
    id: 'q13',
    question: 'Which bin is used for sharp waste such as scalpels and needles?',
    options: ['Yellow', 'Red', 'Blue', 'Green'],
    correctAnswer: 1,
    explanation: 'Sharp medical waste must go into red bins designed to safely contain items like needles and scalpels.'
  },
  {
    id: 'q14',
    question: 'What should you do if a waste bin is full or damaged?',
    options: ['Ignore it', 'Report it immediately', 'Overfill the bin carefully', 'Mix waste with other bins'],
    correctAnswer: 1,
    explanation: 'Full or damaged bins should be reported immediately to avoid spillage or contamination.'
  },
  {
    id: 'q15',
    question: 'Why is it important not to mix hazardous waste with general waste?',
    options: ['To save space', 'To prevent contamination and infection', 'To make disposal easier', 'No specific reason'],
    correctAnswer: 1,
    explanation: 'Mixing hazardous with general waste poses severe health and environmental risks due to cross-contamination.'
  }];

function getRandomQuestions(allQuestions: QuizQuestion[], count: number): QuizQuestion[] {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: mockQuestions,
  currentQuizQuestions: [],
  results: [],

  generateRandomQuiz: () => {
    const randomQuestions = getRandomQuestions(get().questions, 5);
    set({ currentQuizQuestions: randomQuestions });
  },

  submitQuizResult: (staffId, answers) => {
    const questions = get().currentQuizQuestions;
    const score = answers.reduce((total, answer, index) => {
      return total + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const result: QuizResult = {
      id: `result-${Date.now()}`,
      staffId,
      score,
      totalQuestions: questions.length,
      completedAt: new Date(),
      answers
    };

    set((state) => ({
      results: [...state.results, result]
    }));
  }
}));
