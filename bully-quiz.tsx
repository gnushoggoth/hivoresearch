import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Heart, Star, Sparkles } from 'lucide-react';

const BullyQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      question: "A bully is spreading harmful rumors about your friend. What's the most effective response?",
      options: [
        "Spread worse rumors about the bully",
        "Document everything and report it to appropriate authorities",
        "Ignore it completely",
        "Confront the bully alone"
      ],
      correct: 1,
      explanation: "Documentation creates accountability and helps authorities take appropriate action. It's more effective than escalating the conflict or letting harmful behavior continue unchallenged."
    },
    {
      question: "You notice a bully using their popularity to exclude others. What's the best counter-strategy?",
      options: [
        "Build inclusive spaces and invite everyone",
        "Try to become more popular than the bully",
        "Create an exclusive group of your own",
        "Wait for teachers to notice"
      ],
      correct: 0,
      explanation: "Building inclusive communities undermines the bully's power while creating positive change. It addresses the root problem rather than replicating harmful dynamics."
    },
    {
      question: "When confronting someone who's bullying others, what's most important?",
      options: [
        "Having a bigger group than them",
        "Making them feel ashamed",
        "Staying safe and keeping others safe",
        "Proving you're stronger"
      ],
      correct: 2,
      explanation: "Safety should always be the priority. Effective intervention focuses on protection and prevention, not revenge or dominance."
    }
  ];

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2 flex items-center justify-center">
            <Shield className="mr-2" />
            Mindful Protector Quiz
            <Sparkles className="ml-2" />
          </h1>
          <p className="text-purple-600">Understanding how to face challenges with wisdom</p>
        </div>

        {!completed ? (
          <Card className="backdrop-blur-sm bg-white/80 shadow-xl">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-purple-600 mb-2">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>Score: {score}</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-900 mb-4">
                  {questions[currentQuestion].question}
                </h2>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full justify-start text-left p-4 ${
                        showExplanation && index === questions[currentQuestion].correct
                          ? 'bg-green-100 hover:bg-green-200 text-green-800'
                          : 'bg-white hover:bg-purple-50 text-purple-900'
                      }`}
                      disabled={showExplanation}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {showExplanation && (
                <div className="mt-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-purple-800">
                      {questions[currentQuestion].explanation}
                    </p>
                  </div>
                  <Button
                    onClick={nextQuestion}
                    className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="backdrop-blur-sm bg-white/80 shadow-xl text-center p-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="text-pink-500 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-purple-800 mb-2">
              Quiz Complete!
            </h2>
            <p className="text-purple-600 mb-4">
              You scored {score} out of {questions.length}
            </p>
            <p className="text-purple-700">
              Remember: True strength lies in protecting others and creating positive change,
              not in dominating or hurting others.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BullyQuiz;