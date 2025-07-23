import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme for Prism
import 'prismjs/components/prism-python'; // Import Python language for Prism
import problems from '../data/problems.json';
import { ArrowLeftIcon, PlusIcon, MinusIcon, BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

function SyntaxHighlighter({ code }: { code: string }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
      <code className="language-python text-sm font-mono">{code}</code>
    </pre>
  );
}

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function Problem() {
  const { problemNumber } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState(16);
  const [shuffledProblems, setShuffledProblems] = useState<{ number: number; title: string; description: string; solution: string; }[]>([]);
  const currentProblemIndexRef = useRef(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const mode = searchParams.get('mode');

  useEffect(() => {
    if (mode === 'random') {
      setShuffledProblems(shuffleArray(problems));
    } else {
      setShuffledProblems(problems.sort((a, b) => a.number - b.number));
    }
  }, [mode]);

  useEffect(() => {
    if (shuffledProblems.length > 0) {
      const initialProblem = shuffledProblems.find(p => p.number === parseInt(problemNumber as string));
      if (initialProblem) {
        currentProblemIndexRef.current = shuffledProblems.indexOf(initialProblem);
      } else {
        // If the initial problem is not found in the shuffled list (e.g., first load in random mode),
        // default to the first problem in the shuffled list.
        currentProblemIndexRef.current = 0;
        navigate(`/problem/${shuffledProblems[0].number}?mode=${mode}`, { replace: true });
      }
    }
  }, [shuffledProblems, problemNumber, mode, navigate]);

  const problem = shuffledProblems.find(p => p.number === parseInt(problemNumber as string));

  useEffect(() => {
    if (problem) {
      const bookmarked = localStorage.getItem('bookmarkedProblem');
      setIsBookmarked(bookmarked === problem.number.toString());
    }
  }, [problem]);

  const toggleBookmark = () => {
    if (problem) {
      if (isBookmarked) {
        localStorage.removeItem('bookmarkedProblem');
        setIsBookmarked(false);
      } else {
        localStorage.setItem('bookmarkedProblem', problem.number.toString());
        setIsBookmarked(true);
      }
    }
  };

  const getNextProblemNumber = () => {
    currentProblemIndexRef.current = (currentProblemIndexRef.current + 1) % shuffledProblems.length;
    return shuffledProblems[currentProblemIndexRef.current].number;
  };

  const getPreviousProblemNumber = () => {
    currentProblemIndexRef.current = (currentProblemIndexRef.current - 1 + shuffledProblems.length) % shuffledProblems.length;
    return shuffledProblems[currentProblemIndexRef.current].number;
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate(`/problem/${getNextProblemNumber()}?mode=${mode}`),
    onSwipedRight: () => navigate(`/problem/${getPreviousProblemNumber()}?mode=${mode}`),
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  if (!problem) {
    return <div>Problem not found</div>;
  }

  return (
    <div {...handlers} className="min-h-screen bg-gray-900 text-white p-4 font-sans" style={{ fontSize: `${fontSize}px` }}>
      <header className="flex justify-between items-center mb-4">
        <Link to="/" className="p-2">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold text-center">{problem.title}</h1>
        <div className="flex items-center">
          <button onClick={toggleBookmark} className="p-2">
            {isBookmarked ? (
              <BookmarkSolidIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <BookmarkOutlineIcon className="h-6 w-6" />
            )}
          </button>
          <button onClick={() => setFontSize(fz => Math.max(8, fz - 1))} className="p-2">
            <MinusIcon className="h-6 w-6" />
          </button>
          <button onClick={() => setFontSize(fz => Math.min(32, fz + 1))} className="p-2">
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>
      </header>
      <main className="prose prose-invert max-w-none">
        <div className="mb-8 p-4 rounded-lg bg-gray-800">
          <h2 className="text-xl font-bold mb-2">Problem</h2>
          <p>{problem.description}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-800">
          <h2 className="text-xl font-bold mb-2">Solution</h2>
          <SyntaxHighlighter code={problem.solution} />
        </div>
      </main>
    </div>
  );
}
