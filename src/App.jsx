import { useEffect, useState } from "react";
import "./App.css";
import { FaPause } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";

function App() {
  // fixed variable diclaration
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  const INITIAL_SNAKE = [{ x: 10, y: 10 }];
  const INITIAL_FOOD = { x: 15, y: 15 };
  const INITIAL_DIRECTION = "RIGHT";

  // React hook declaration

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setdirection] = useState(INITIAL_DIRECTION);
  const [score, setscore] = useState(0);
  const [gameOver, setgameOver] = useState(false);
  const [pauseGame, setpauseGame] = useState(false);
  const [startGame, setstartGame] = useState(false);

  // new food generation
  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    return snake.some((item) => item.x === newFood.x && item.y === newFood.y)
      ? generateFood()
      : newFood;
  };

  // snake move handeling
  const moveSnake = () => {
    if (gameOver) return;

    const head = { ...snake[0] };

    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }

    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      snake.some((item) => item.x === head.x && item.y === head.y)
    ) {
      setgameOver(true);
      return;
    }
    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setscore(score + 1);
      setFood(generateFood());
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  // handle key press
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setdirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setdirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setdirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setdirection("RIGHT");
          break;
          console.log(e);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [direction]);

  // set movement with time interval
  useEffect(() => {
    if (!startGame || pauseGame || gameOver) return;
    const gameLoop = setInterval(moveSnake, 100);
    return () => {
      clearInterval(gameLoop);
    };
  }, [snake, direction, gameOver, startGame, pauseGame]);

  // Grid rendering
  const renderGrid = () => {
    const grid = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const isSnake = snake.some((item) => item.x === j && item.y === i);
        const isFood = food.x === j && food.y === i;
        grid.push(
          <div
            key={`${i}-${j}`}
            className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
          ></div>
        );
      }
    }

    return grid;
  };

  const handleStartPause = () => {
    if (gameOver) return;

    if (!startGame) {
      // Start the game
      setstartGame(true);
      setpauseGame(false);
      setSnake(INITIAL_SNAKE);
      setFood(INITIAL_FOOD);
      setdirection(INITIAL_DIRECTION);
      setscore(0);
      setgameOver(false);
    } else {
      // Toggle pause/resume
      setpauseGame((prev) => !prev);
    }
  };

  let restartGame = () => {
    setstartGame(true);
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setdirection(INITIAL_DIRECTION);
    setscore(0);
    setgameOver(false);
  };


  return (
    <div className="game-container">
      <div className="top-bar">
        <div className="score">Score: {score}</div>

        {/* Game play & pause button */}

        <div className="game-button">
          <button onClick={handleStartPause} className="playPauseBtn">
            {!startGame || pauseGame ? <FaPlay /> : <FaPause />}
          </button>
        </div>
      </div>

      {/* game board */}

      <div
        className="game-board"
        style={{
          gridTemplateColumns: `repeat( ${GRID_SIZE} , ${CELL_SIZE}px )`,
          width: `${GRID_SIZE * CELL_SIZE}px`,
          height: `${GRID_SIZE * CELL_SIZE}px`,
        }}
      >
        {renderGrid()}
      </div>

      {/* Restarting game */}
      {gameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          <p className="score">Your Score : {score}</p>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default App;
