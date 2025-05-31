
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useQuizStore } from '@/stores/quizStore';
import { useSupabaseAuthStore } from '@/stores/supabaseAuthStore';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EducationQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const { questions, submitQuizResult } = useQuizStore();
  const { user } = useSupabaseAuthStore();

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to complete the quiz.',
        variant: 'destructive',
      });
      return;
    }

    submitQuizResult(user.id, selectedAnswers);
    setShowResults(true);
    
    const score = selectedAnswers.reduce((total, answer, index) => {
      return total + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const percentage = Math.round((score / questions.length) * 100);
    
    toast({
      title: 'Quiz Completed!',
      description: `You scored ${score}/${questions.length} (${percentage}%)`,
    });
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  if (!quizStarted) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Environmental Awareness Quiz</h3>
          <p className="text-gray-600">Test your knowledge of proper waste management procedures</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <h4 className="font-medium text-blue-900">Quiz Information:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• {questions.length} multiple choice questions</li>
            <li>• No time limit</li>
            <li>• Immediate feedback on completion</li>
            <li>• Helps improve waste management knowledge</li>
          </ul>
        </div>

        <Button 
          onClick={handleStartQuiz}
          size="lg"
          className="bg-healthcare-green hover:bg-healthcare-green/90"
        >
          Start Quiz
        </Button>
      </div>
    );
  }

  if (showResults) {
    const score = selectedAnswers.reduce((total, answer, index) => {
      return total + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">Quiz Results</h3>
          <div className="text-4xl font-bold text-healthcare-blue">
            {score}/{questions.length}
          </div>
          <div className="text-xl text-gray-600">{percentage}% Correct</div>
          <Progress value={percentage} className="w-full max-w-md mx-auto" />
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span>Question {index + 1}</span>
                  </CardTitle>
                  <CardDescription className="text-base font-medium">
                    {question.question}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Your answer:</span> {question.options[userAnswer]}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm">
                        <span className="font-medium">Correct answer:</span> {question.options[question.correctAnswer]}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <span className="font-medium">Explanation:</span> {question.explanation}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button onClick={handleRestartQuiz} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Quiz Again
          </Button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswers[currentQuestion] === index ? 'default' : 'outline'}
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="bg-healthcare-blue hover:bg-healthcare-blue/90"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationQuiz;
