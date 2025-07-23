import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ListBulletIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import problems from "../data/problems.json";

export default function Home() {
  const navigate = useNavigate();
  const [jumpProblemNumber, setJumpProblemNumber] = useState<number | null>(
    null
  );
  const [isJumpModalOpen, setIsJumpModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [bookmarkedProblem, setBookmarkedProblem] = useState<string | null>(
    null
  );

  useEffect(() => {
    setBookmarkedProblem(localStorage.getItem("bookmarkedProblem"));
  }, []);

  const handleJumpToProblem = () => {
    if (
      jumpProblemNumber &&
      problems.some((p) => p.number === jumpProblemNumber)
    ) {
      navigate(`/problem/${jumpProblemNumber}?mode=sequential`);
      setIsJumpModalOpen(false);
    } else if (jumpProblemNumber) {
      alert("Problem not found!");
    }
  };

  const handleProblemClick = (problemNumber: number) => {
    navigate(`/problem/${problemNumber}?mode=sequential`);
    setIsListModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-12 text-center">
        LeetCode on the go!
      </h1>
      <div className="space-y-6">
        {bookmarkedProblem && (
          <button
            onClick={() =>
              navigate(`/problem/${bookmarkedProblem}?mode=sequential`)
            }
            className="w-80 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center"
          >
            <BookmarkIcon className="h-6 w-6 mr-3" />
            Bookmarked Problem
          </button>
        )}
        <button
          onClick={() => setIsListModalOpen(true)}
          className="w-80 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center"
        >
          <ListBulletIcon className="h-6 w-6 mr-3" />
          List All Problems
        </button>
        <Link to="/problem/1?mode=sequential" className="block">
          <button className="w-80 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center">
            <ArrowRightIcon className="h-6 w-6 mr-3" />
            Sequential Mode
          </button>
        </Link>
        <button
          onClick={() => {
            const randomIndex = Math.floor(Math.random() * problems.length);
            navigate(`/problem/${problems[randomIndex].number}?mode=random`);
          }}
          className="w-80 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center"
        >
          <ArrowsRightLeftIcon className="h-6 w-6 mr-3" />
          Random Mode
        </button>
        <button
          onClick={() => setIsJumpModalOpen(true)}
          className="w-80 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center"
        >
          <MagnifyingGlassIcon className="h-6 w-6 mr-3" />
          Jump to Problem
        </button>
      </div>

      {isJumpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg relative">
            <button
              onClick={() => setIsJumpModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-white">
              Jump to Problem
            </h2>
            <input
              type="number"
              placeholder="Enter Problem Number"
              className="w-full p-4 rounded-lg text-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              onChange={(e) => setJumpProblemNumber(parseInt(e.target.value))}
            />
            <button
              onClick={handleJumpToProblem}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center"
            >
              Jump
            </button>
          </div>
        </div>
      )}

      {isListModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg relative w-11/12 max-w-md h-3/4 overflow-y-auto">
            <button
              onClick={() => setIsListModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-white">All Problems</h2>
            <ul className="divide-y divide-gray-700">
              {problems
                .sort((a, b) => a.number - b.number)
                .map((p) => (
                  <li key={p.number}>
                    <button
                      onClick={() => handleProblemClick(p.number)}
                      className="w-full text-left py-3 px-4 text-white text-lg hover:bg-gray-700"
                    >
                      Problem {p.number}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
