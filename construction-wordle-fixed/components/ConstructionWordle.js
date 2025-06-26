import React, { useState, useRef, useEffect } from "react";

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
      const firstEmpty = letterInputs.findIndex((l) => l === "");
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

  const getLetterColors = (guess, answer) => {
    const result = Array(5).fill("bg-gray-300");
    const letterUsed = Array(5).fill(false);

    // First pass: correct position
    for (let i = 0; i < 5; i++) {
      if (guess[i] === answer[i]) {
        result[i] = "bg-green-400";
        letterUsed[i] = true;
      }
    }

    // Second pass: wrong position, only if not already marked
    for (let i = 0; i < 5; i++) {
      if (result[i] === "bg-green-400") continue;
      for (let j = 0; j < 5; j++) {
        if (!letterUsed[j] && guess[i] === answer[j]) {
          result[i] = "bg-yellow-300";
          letterUsed[j] = true;
          break;
        }
      }
    }

    return result;
  };

  const isLoss = result.toLowerCase().includes("out of attempts");

  return (
    <div>
      <h1>Construction Wordle</h1>
      <div className="space-y-2 mt-4">
        {guesses.map((g, i) => {
          const colors = getLetterColors(g, targetWord);
          return (
            <div key={i} className="word-row">
              {g.split("").map((letter, j) => (
                <div
                  key={j}
                  className={`letter-box ${colors[j]}`}
                >
                  {letter.toUpperCase()}
                </div>
              ))}
            </div>
          );
        })}

        {!gameOver && guesses.length < 6 && (
          <div className="word-row">
            {letterInputs.map((letter, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={letter}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
        )}
      </div>

      <button onClick={handleGuess} disabled={gameOver}>
        Submit
      </button>

      {gameOver && (
        <div className={`result-box ${isLoss ? "loss" : ""}`}>
          <div>{result}</div>
          {isLoss && (
            <>
              <div className="loss-message">The house always wins — you owe Cori 5 dollars.</div>
              <a
                href="https://venmo.com/cori-spetnagel?note=Best%2520Intern%2520Ever"
                target="_blank"
                rel="noopener noreferrer"
                className="venmo-button"
              >
                Pay Now
              </a>
            </>
          )}
        </div>
      )}

      {gameOver && (
        <button onClick={handleRestart} style={{ marginTop: "1rem" }}>
          Play Again
        </button>
      )}
    </div>
  );
}
