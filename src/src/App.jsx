import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle, Award, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import 'app.css'

// Sample Questions Data (Fallback)
const SAMPLE_QUESTIONS = [
  {
    id: 'q1',
    text: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
    explanation: 'Paris is the capital and most populous city of France.',
  },
  {
    id: 'q2',
    text: 'Which HTML tag is used to define an internal style sheet?',
    options: ['<script>', '<css>', '<style>', '<link>'],
    correctAnswer: '<style>',
    explanation: 'The <style> tag is used to define style information (CSS) for an HTML document.',
  },
  {
    id: 'q3',
    text: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswer: 'Pacific Ocean',
    explanation: 'The Pacific Ocean is the largest and deepest of Earth\'s five oceanic divisions.',
  },
];

// ProgressBar Component
const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// QuestionCard Component
const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showFeedback,
  userAnswerCorrect,
  onElaborate,
  isElaborating,
  elaboratedExplanation,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl">
      <div className="mb-4">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Question {questionNumber} of {totalQuestions}
        </p>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-1">
          {question.text}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = question.correctAnswer === option;
          let buttonClass = "w-full text-left p-4 rounded-lg border transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ";

          if (showFeedback) {
            if (isCorrect) {
              buttonClass += "bg-green-100 border-green-400 text-green-700 dark:bg-green-700 dark:border-green-500 dark:text-green-100 ring-2 ring-green-500";
            } else if (isSelected && !isCorrect) {
              buttonClass += "bg-red-100 border-red-400 text-red-700 dark:bg-red-700 dark:border-red-500 dark:text-red-100 ring-2 ring-red-500";
            } else {
              buttonClass += "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600";
            }
          } else {
             if (isSelected) {
              buttonClass += "bg-blue-100 border-blue-500 text-blue-700 ring-2 ring-blue-500 dark:bg-blue-700 dark:border-blue-500 dark:text-blue-100";
            } else {
              buttonClass += "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600";
            }
          }
          
          return (
            <button
              key={index}
              onClick={() => !showFeedback && onAnswerSelect(question.id, option)}
              className={buttonClass}
              disabled={showFeedback}
            >
              <span className="font-medium">{option}</span>
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <div className={`mt-4 p-3 rounded-lg ${userAnswerCorrect ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
          <div className="flex items-center">
            {userAnswerCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
            )}
            <p className={`text-sm font-medium ${userAnswerCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {userAnswerCorrect ? "Correct!" : "Incorrect."} The correct answer is: <strong>{question.correctAnswer}</strong>
            </p>
          </div>
          {question.explanation && !elaboratedExplanation && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              {question.explanation}
            </p>
          )}
          {elaboratedExplanation && (
             <div className="mt-2 p-3 rounded-md bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-700 dark:text-blue-300">{elaboratedExplanation}</p>
             </div>
          )}
          <button
            onClick={onElaborate}
            disabled={isElaborating}
            className="mt-3 text-xs bg-purple-100 hover:bg-purple-200 dark:bg-purple-700 dark:hover:bg-purple-600 text-purple-700 dark:text-purple-200 font-medium py-1.5 px-3 rounded-md flex items-center transition-colors disabled:opacity-70"
          >
            {isElaborating ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1.5" />
            )}
            {isElaborating ? 'Elaborating...' : 'Elaborate Explanation ✨'}
          </button>
        </div>
      )}
    </div>
  );
};

// ScoreScreen Component
const ScoreScreen = ({ score, totalQuestions, onRestart, userAnswers, questions }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  let feedbackMessage = "";
  let feedbackColor = "";

  if (percentage >= 80) {
    feedbackMessage = "Excellent work! You're a quiz master!";
    feedbackColor = "text-green-600 dark:text-green-400";
  } else if (percentage >= 50) {
    feedbackMessage = "Good job! You passed the quiz.";
    feedbackColor = "text-blue-600 dark:text-blue-400";
  } else {
    feedbackMessage = "Keep practicing! You can do better.";
    feedbackColor = "text-red-600 dark:text-red-400";
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
      <Award className="h-20 w-20 text-yellow-500 dark:text-yellow-400 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Quiz Completed!</h2>
      <p className={`text-lg font-medium ${feedbackColor} mb-4`}>
        {feedbackMessage}
      </p>
      <p className="text-5xl font-extrabold text-gray-700 dark:text-gray-200 mb-1">
        {score} / {totalQuestions}
      </p>
      <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
        ({percentage}%)
      </p>

      <div className="my-6">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Review Your Answers:</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto text-left px-2">
          {questions.map((q, index) => (
            <div key={q.id} className="p-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Q{index + 1}: {q.text}</p>
              <p className={`text-xs ${userAnswers[q.id] === q.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                Your answer: {userAnswers[q.id] || "Not answered"} {userAnswers[q.id] !== q.correctAnswer ? `(Correct: ${q.correctAnswer})` : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-150 ease-in-out flex items-center justify-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        <RotateCcw className="h-5 w-5 mr-2" />
        Restart Quiz
      </button>
    </div>
  );
};

// Main App Component
export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizState, setQuizState] = useState('not-started'); // 'not-started', 'generating', 'in-progress', 'completed'
  const [score, setScore] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showFeedbackForCurrent, setShowFeedbackForCurrent] = useState(false);
  
  const [customTopic, setCustomTopic] = useState('');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const [elaboratedExplanation, setElaboratedExplanation] = useState('');
  const [isElaborating, setIsElaborating] = useState(false);
  const [elaborationError, setElaborationError] = useState('');


  // Function to make API calls to Gemini
  const callGeminiAPI = async (prompt, isJson = false) => {
    const apiKey = ""; // Provided by Canvas environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    let payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    if (isJson) {
      payload.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              text: { type: "STRING", description: "The question text." },
              options: { type: "ARRAY", items: { type: "STRING" }, description: "Array of 4 answer options." },
              correctAnswer: { type: "STRING", description: "The correct answer from the options." },
              explanation: { type: "STRING", description: "A brief explanation for the correct answer." }
            },
            required: ["text", "options", "correctAnswer", "explanation"]
          }
        }
      };
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(`API request failed with status ${response.status}: ${errorData?.error?.message || response.statusText}`);
      }
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const responseText = result.candidates[0].content.parts[0].text;
        return isJson ? JSON.parse(responseText) : responseText;
      } else {
        console.error("Unexpected API response structure:", result);
        throw new Error("Failed to get valid content from API response.");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error; // Re-throw to be caught by calling function
    }
  };

  const handleGenerateQuizFromTopic = async () => {
    if (!customTopic.trim()) {
      setGenerationError("Please enter a topic.");
      return;
    }
    setIsGeneratingQuestions(true);
    setGenerationError('');
    setQuizState('generating');

    const prompt = `Generate 5 multiple-choice quiz questions about "${customTopic}". Each question should have 4 options, one correct answer, and a brief explanation. Ensure options are distinct and plausible.`;

    try {
      const generatedQuestions = await callGeminiAPI(prompt, true);
      if (Array.isArray(generatedQuestions) && generatedQuestions.length > 0 && generatedQuestions.every(q => q.text && q.options && q.correctAnswer && q.explanation && q.options.length === 4)) {
        const formattedQuestions = generatedQuestions.map((q, index) => ({
          ...q,
          id: `gq${index + 1}-${Date.now()}`, // Unique ID
        }));
        setQuestions(formattedQuestions);
        handleStartQuiz(formattedQuestions); // Start quiz with new questions
      } else {
        console.error("Generated questions format is invalid:", generatedQuestions);
        throw new Error("Received invalid question format from API.");
      }
    } catch (error) {
      setGenerationError(`Failed to generate quiz: ${error.message}. Please try again or use the sample quiz.`);
      setQuestions(SAMPLE_QUESTIONS.sort(() => Math.random() - 0.5)); // Fallback to sample
      setQuizState('not-started'); // Revert state
    } finally {
      setIsGeneratingQuestions(false);
    }
  };
  
  const handleElaborateExplanation = async () => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    setIsElaborating(true);
    setElaborationError('');
    const prompt = `The question was: "${currentQ.text}". The correct answer is "${currentQ.correctAnswer}". The current explanation is: "${currentQ.explanation}". Please provide a more detailed and elaborate explanation for why "${currentQ.correctAnswer}" is correct, possibly including more context or related information.`;
    
    try {
      const detailedExplanation = await callGeminiAPI(prompt);
      setElaboratedExplanation(detailedExplanation);
    } catch (error) {
      setElaborationError(`Failed to get elaboration: ${error.message}`);
      setElaboratedExplanation(''); // Clear any previous elaboration
    } finally {
      setIsElaborating(false);
    }
  };


  useEffect(() => {
    // Initialize with sample questions shuffled
    if (quizState === 'not-started' && questions.length === 0) {
        setQuestions(SAMPLE_QUESTIONS.sort(() => Math.random() - 0.5));
    }
  }, [quizState, questions.length]);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleStartQuiz = (customQuestions = null) => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
    setShowFeedbackForCurrent(false);
    setElaboratedExplanation('');
    setElaborationError('');
    
    if (customQuestions) {
        setQuestions(customQuestions); // Use provided questions (e.g., from Gemini)
    } else {
        // Shuffle sample questions again for a new random quiz
        setQuestions(SAMPLE_QUESTIONS.sort(() => Math.random() - 0.5));
    }
    setQuizState('in-progress');
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
    setShowFeedbackForCurrent(true);
    setElaboratedExplanation(''); // Reset elaboration for new answer
    setElaborationError('');
  };

  const handleNextQuestion = () => {
    setShowFeedbackForCurrent(false);
    setElaboratedExplanation('');
    setElaborationError('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      calculateScoreAndFinish();
    }
  };
  
  const calculateScoreAndFinish = () => {
    let currentScore = 0;
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setQuizState('completed');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  if (quizState !== 'not-started' && quizState !== 'generating' && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <p className="text-gray-700 dark:text-gray-300">No questions loaded. Please try generating a quiz or refreshing.</p>
      </div>
    );
  }


  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-900 p-4 transition-colors duration-300 font-sans`}>
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle dark mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="w-full max-w-2xl">
        {(quizState === 'not-started' || quizState === 'generating') && (
          <div className="text-center bg-white dark:bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl">
            <HelpCircle className="h-24 w-24 text-blue-600 dark:text-blue-400 mx-auto mb-6"/>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Welcome to the Quiz!</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Test your knowledge! Choose an option below.
            </p>
            
            <div className="mb-6 space-y-3">
                <input 
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., 'Solar System')"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    disabled={isGeneratingQuestions}
                />
                <button
                    onClick={handleGenerateQuizFromTopic}
                    disabled={isGeneratingQuestions || !customTopic.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-150 ease-in-out text-lg shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isGeneratingQuestions ? <Loader2 className="h-6 w-6 mr-2 animate-spin"/> : <Sparkles className="h-6 w-6 mr-2"/>}
                    {isGeneratingQuestions ? 'Generating Quiz...' : 'Generate Quiz on Topic ✨'}
                </button>
                {generationError && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{generationError}</p>}
            </div>

            <div className="my-4 text-center">
                <p className="text-gray-500 dark:text-gray-400">OR</p>
            </div>
            
            <button
              onClick={() => handleStartQuiz()}
              disabled={isGeneratingQuestions}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-150 ease-in-out text-lg shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60"
            >
              Start Random Sample Quiz
            </button>
          </div>
        )}

        {quizState === 'in-progress' && questions.length > 0 && (
          <>
            <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
            <QuestionCard
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={userAnswers[questions[currentQuestionIndex].id]}
              onAnswerSelect={handleAnswerSelect}
              showFeedback={showFeedbackForCurrent}
              userAnswerCorrect={showFeedbackForCurrent && userAnswers[questions[currentQuestionIndex].id] === questions[currentQuestionIndex].correctAnswer}
              onElaborate={handleElaborateExplanation}
              isElaborating={isElaborating}
              elaboratedExplanation={elaboratedExplanation}
            />
             {elaborationError && <p className="text-red-500 dark:text-red-400 text-sm mt-2 text-center">{elaborationError}</p>}
            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={() => { /* Optional: Previous Question Logic */ }}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center opacity-50 cursor-not-allowed"
                    disabled 
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Previous
                </button>
                {showFeedbackForCurrent ? (
                    <button
                        onClick={handleNextQuestion}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        <ChevronRight className="h-5 w-5 ml-1" />
                    </button>
                ) : (
                    <button
                        className="bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg flex items-center opacity-50 cursor-not-allowed"
                        disabled
                    >
                        Next Question
                        <ChevronRight className="h-5 w-5 ml-1" />
                    </button>
                )}
            </div>
          </>
        )}

        {quizState === 'completed' && (
          <ScoreScreen
            score={score}
            totalQuestions={questions.length}
            onRestart={() => {
                setQuizState('not-started'); // Go back to topic selection / random quiz
                setCustomTopic(''); // Clear topic
                setQuestions(SAMPLE_QUESTIONS.sort(() => Math.random() - 0.5)); // Reset to sample questions initially
            }}
            userAnswers={userAnswers}
            questions={questions}
          />
        )}
      </div>
      <footer className="text-center mt-12 pb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          MCQ Quiz App &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
