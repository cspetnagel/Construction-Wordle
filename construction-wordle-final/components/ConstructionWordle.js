import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Update or remove this if needed

const constructionWords = [
  "crane", "steel", "rebar", "brick", "drill", "mixer", "plumb", "level", "track",
  "tools", "joint", "plane", "screw", "floor", "paint", "lamps", "tiles", "hooks", "cable",
  "panel", "clamp", "sawer", "brads", "bolts", "wires", "shear", "jacks", "plugs", "vents",
  "laser", "piles", "posts", "ridge", "chalk", "brace", "cover", "slabs", "stake", "grout"
];

const getRandomWord = () => {
  return constructionWords[Math.floor(Math.random() * constructionWords.length)].toLowerCase();
};

export default function ConstructionWordle() {
  const [targetWord, setTargetWord] = useState(getRandomWord());
  const [letterInputs, setLetterInputs] = useState(["", "", "", "", ""]);
  const [guesses, setGuesses] = useState([]);
  const [result, setResult] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!gameOver) {
      const firstEmpty = letterInputs.findIndex(l => l === "");
      if (firstEmpty !== -1 && inputRefs.current[firstEmpty]) {
        inputRefs.current[firstEmpty].focus();
      }
    }
  }, [letterInputs, gameOver]);

  const handleInputChange = (value, index) => {
    const newInputs = [...letterInputs];
    const char = value.slice(-1).toUpperCase();
    newInputs[index] = char;
    setLetterInputs(newInputs);
    if (char && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !letterInputs[index] && index > 0) {
      const newInputs = [...letterInputs];
      newInputs[index - 1] = "";
      setLetterInputs(newInputs);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      handleGuess();
    }
  };

  const handleGuess = () => {
    const guess = letterInputs.join("").toLowerCase();
    if (guess.length !== 5 || gameOver) return;
    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);

    if (guess === targetWord) {
      setResult("Correct! You've guessed the word.");
      setGameOver(true);
    } else if (newGuesses.length === 6) {
      setResult(`Out of attempts! The word was: ${targetWord}`);
      setGameOver(true);
    }

    setLetterInputs(["", "", "", "", ""]);
  };

  const handleRestart = () => {
    setTargetWord(getRandomWord());
    setLetterInputs(["", "", "", "", ""]);
    setGuesses([]);
    setResult("");
    setGameOver(false);
  };

  const getLetterColor = (letter, index) => {
    if (letter === targetWord[index]) return "bg-green-400";
    if (targetWord.includes(letter)) return "bg-yellow-300";
    return "bg-gray-300";
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Construction Wordle</h1>
      <div className="space-y-2 mt-4">
        {guesses.map((g, i) => (
          <div key={i} className="flex justify-center space-x-1">
            {g.split("").map((letter, j) => (
              <div
                key={j}
                className={`w-10 h-10 flex items-center justify-center font-bold text-white rounded ${getLetterColor(letter, j)}`}
              >
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
        {!gameOver && guesses.length < 6 && (
          <div className="flex justify-center space-x-1">
            {letterInputs.map((letter, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={letter}
                ref={el => inputRefs.current[index] = el}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 text-center text-xl border rounded uppercase"
              />
            ))}
          </div>
        )}
      </div>
      <Button onClick={handleGuess} className="mt-2" disabled={gameOver}>Submit</Button>
      {result && (
        <div className="mt-4 p-4 border rounded bg-white shadow">
          {result}
        </div>
      )}
      {gameOver && <Button onClick={handleRestart} className="mt-4">Play Again</Button>}
    </div>
  );
}
