import React, { useState, useEffect } from "react";

interface CodeAnalysis {
  styleIssues: string[];
  logicIssues: string[];
  errorMessage: string;
  success: boolean;
  debugHints: string[];
}

interface Exercise {
  id: number;
  title: string;
  description: string;
  template: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface ProgressData {
  exercisesCompleted: number;
  totalErrors: number;
  hintsUsed: number;
  completedExercises: number[];
  lastAttempt: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

const CodeLearningAssistant: React.FC = () => {
  const [code, setCode] = useState<string>("print('Hello, World!')");
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [currentView, setCurrentView] = useState<'editor' | 'exercises' | 'tutorials' | 'dashboard'>('editor');
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [progress, setProgress] = useState<ProgressData>({
    exercisesCompleted: 0,
    totalErrors: 0,
    hintsUsed: 0,
    completedExercises: [],
    lastAttempt: new Date().toISOString(),
    skillLevel: 'beginner'
  });

  // Sample exercises database
  const exercises: Exercise[] = [
    {
      id: 1,
      title: "Hello World",
      description: "Write a program that prints 'Hello, World!' to the console.",
      template: "print('Hello, World!')",
      difficulty: 'beginner',
      category: 'basics'
    },
    {
      id: 2,
      title: "Sum of Two Numbers",
      description: "Create a function that takes two numbers and returns their sum.",
      template: "def add(a, b):\n    # Your code here\n    pass\n\nresult = add(3, 5)\nprint(result)",
      difficulty: 'beginner',
      category: 'functions'
    },
    {
      id: 3,
      title: "Factorial Calculator",
      description: "Write a function that calculates the factorial of a number using recursion.",
      template: "def factorial(n):\n    # Your code here\n    pass\n\nprint(factorial(5))",
      difficulty: 'intermediate',
      category: 'recursion'
    },
    {
      id: 4,
      title: "List Manipulation",
      description: "Create a program that filters even numbers from a list and squares them.",
      template: "numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n# Your code here",
      difficulty: 'intermediate',
      category: 'lists'
    }
  ];

  const tutorials = [
    {
      title: "Introduction to Python",
      steps: [
        "Welcome to Python! Let's start with the basics.",
        "Python uses print() to display output. Try: print('Hello World')",
        "Variables store data. Example: name = 'Alice'",
        "Conditionals: if name == 'Alice': print('Hello Alice!')",
        "Loops: for i in range(3): print(i)"
      ]
    },
    {
      title: "Functions and Modules",
      steps: [
        "Functions are reusable code blocks. def greet(): print('Hello!')",
        "Parameters: def greet(name): print(f'Hello {name}!')",
        "Return values: def square(x): return x * x",
        "Import modules: import math\nprint(math.sqrt(16))"
      ]
    }
  ];

  // Basic code analysis function
  const analyzeCode = (codeString: string): CodeAnalysis => {
    const styleIssues: string[] = [];
    const logicIssues: string[] = [];
    let errorMessage = "";
    let success = true;
    const debugHints: string[] = [];

    // Style analysis
    const lines = codeString.split('\n');
    lines.forEach((line, index) => {
      if (line.length > 80) {
        styleIssues.push(`Line ${index + 1}: Line is too long (${line.length} characters)`);
      }
      if (line.includes('\t')) {
        styleIssues.push(`Line ${index + 1}: Use spaces instead of tabs for indentation`);
      }
    });

    if (!codeString.includes('#')) {
      styleIssues.push("Consider adding comments to explain your code");
    }

    // Simple error detection (simulated)
    if (codeString.includes('print(') && !codeString.includes(')')) {
      errorMessage = "Syntax Error: Missing closing parenthesis in print statement";
      success = false;
      debugHints.push("Check that all parentheses are properly closed");
      debugHints.push("Make sure function calls have matching opening and closing parentheses");
    }

    if (codeString.includes('if') && !codeString.includes(':')) {
      errorMessage = "Syntax Error: Missing colon after if statement";
      success = false;
      debugHints.push("Add a colon at the end of if statements: if condition:");
      debugHints.push("Remember that Python uses colons to start code blocks");
    }

    if (codeString.includes('def') && !codeString.includes(':')) {
      errorMessage = "Syntax Error: Missing colon after function definition";
      success = false;
      debugHints.push("Function definitions need a colon: def my_function():");
      debugHints.push("The colon indicates the start of the function body");
    }

    // If no errors detected, simulate success
    if (success) {
      errorMessage = "Code executed successfully!";
      
      // Simple logic analysis
      if (codeString.includes('pass')) {
        logicIssues.push("Found 'pass' statement - consider implementing actual logic");
      }
      if (codeString.includes('while True:')) {
        logicIssues.push("Infinite loop detected - make sure there's a break condition");
      }
    }

    return { styleIssues, logicIssues, errorMessage, success, debugHints };
  };

  const handleCodeSubmit = () => {
    const analysisResult = analyzeCode(code);
    setAnalysis(analysisResult);
    
    // Update progress
    setProgress(prev => ({
      ...prev,
      totalErrors: prev.totalErrors + (analysisResult.success ? 0 : 1),
      lastAttempt: new Date().toISOString()
    }));
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCode(exercise.template);
    setCurrentView('editor');
  };

  const handleTutorialStart = () => {
    setTutorialStep(0);
    setCurrentView('tutorials');
  };

  const handleNextTutorialStep = () => {
    if (tutorialStep < tutorials[0].steps.length - 1) {
      setTutorialStep(prev => prev + 1);
    }
  };

  const handlePreviousTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(prev => prev - 1);
    }
  };

  const filteredExercises = exercises.filter(ex => ex.difficulty === skillLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <header className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Code Learning Assistant</h1>
        <nav className="flex flex-wrap gap-4">
          <button
            onClick={() => setCurrentView('editor')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'editor' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'
            }`}
          >
            Code Editor
          </button>
          <button
            onClick={() => setCurrentView('exercises')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'exercises' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'
            }`}
          >
            Exercises
          </button>
          <button
            onClick={handleTutorialStart}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'tutorials' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'
            }`}
          >
            Tutorials
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'
            }`}
          >
            Dashboard
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto">
        {currentView === 'editor' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Code Editor</h2>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            {currentExercise && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-blue-800">Current Exercise: {currentExercise.title}</h3>
                <p className="text-blue-700">{currentExercise.description}</p>
              </div>
            )}

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 font-mono text-sm border border-gray-300 rounded-lg p-4 mb-4 resize-none"
              placeholder="Write your Python code here..."
            />
            
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleCodeSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Run Code
              </button>
              <button
                onClick={() => setCode("")}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear
              </button>
            </div>

            {analysis && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Analysis Results</h3>
                
                <div className={`p-3 rounded-lg mb-4 ${
                  analysis.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
                }`}>
                  <p className={analysis.success ? 'text-green-800' : 'text-red-800'}>
                    {analysis.errorMessage}
                  </p>
                </div>

                {analysis.styleIssues.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Style Suggestions:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.styleIssues.map((issue, index) => (
                        <li key={index} className="text-yellow-700">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.logicIssues.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Logic Considerations:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.logicIssues.map((issue, index) => (
                        <li key={index} className="text-blue-700">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.debugHints.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Debugging Hints:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.debugHints.map((hint, index) => (
                        <li key={index} className="text-purple-700">{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentView === 'exercises' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Coding Exercises</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredExercises.map((exercise) => (
                <div key={exercise.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-2">{exercise.title}</h3>
                  <p className="text-gray-600 mb-3">{exercise.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                      {exercise.difficulty}
                    </span>
                    <button
                      onClick={() => handleExerciseSelect(exercise)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Start Exercise
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'tutorials' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Interactive Tutorial</h2>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                {tutorials[0].title} - Step {tutorialStep + 1} of {tutorials[0].steps.length}
              </h3>
              <p className="text-blue-700 mb-4">{tutorials[0].steps[tutorialStep]}</p>
              
              <div className="flex gap-4">
                <button
                  onClick={handlePreviousTutorialStep}
                  disabled={tutorialStep === 0}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextTutorialStep}
                  disabled={tutorialStep === tutorials[0].steps.length - 1}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentView('editor')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Try in Editor
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'dashboard' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Learning Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Exercises Completed</h3>
                <p className="text-3xl font-bold text-green-600">{progress.exercisesCompleted}</p>
              </div>
              
              <div className="bg-red-100 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Total Errors</h3>
                <p className="text-3xl font-bold text-red-600">{progress.totalErrors}</p>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Hints Used</h3>
                <p className="text-3xl font-bold text-blue-600">{progress.hintsUsed}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Suggested Next Steps</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredExercises.slice(0, 2).map((exercise) => (
                  <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{exercise.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                    <button
                      onClick={() => handleExerciseSelect(exercise)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Start Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Progress Timeline</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600">Last activity: {new Date(progress.lastAttempt).toLocaleString()}</p>
                <p className="text-gray-600">Current skill level: {progress.skillLevel}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center mt-12 text-gray-600">
        <p>Code Learning Assistant - Built for educational purposes</p>
        <p className="text-sm">Works completely offline • Lightweight • Beginner-friendly</p>
      </footer>
    </div>
  );
};

export default CodeLearningAssistant;
