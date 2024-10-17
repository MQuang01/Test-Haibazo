import React, { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  const [statusBtn, setStatusBtn] = useState(false);
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(0);
  const [circles1, setCircles] = useState([]);
  const [circles2, setCircles1] = useState([]);
  const [message, setMessage] = useState({});
  const [highlightedCircles, setHighlightedCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeoutIds, setTimeoutIds] = useState([]);

  const pickNumber = (numberSelected) => {
    if (!numberSelected){
        return;
    }
    if (numberSelected !== circles2[0].number) {
      setMessage({
        text: "GAME OVER",
        color: "red",
      });
      setSelectedCircle(null);
      setIsRunning(false);
      return;
    }

    setSelectedCircle(numberSelected);
    setHighlightedCircles((prevHighlights) => [
      ...prevHighlights,
      numberSelected,
    ]);
    setCircles1((prevCircles) => {
      return prevCircles.filter((circle) => circle.number !== numberSelected);
    });
    const newTimeoutId = setTimeout(() => {
      setCircles((prevCircles) => {
        const updatedCircles = prevCircles.filter(
          (circle) => circle.number !== numberSelected
        );

        if (updatedCircles.length === 0) {
          setMessage({
            text: "ALL CLEARED",
            color: "green",
          });
          setIsRunning(false);
        }

        return updatedCircles;
      });
      setHighlightedCircles((prevHighlights) =>
        prevHighlights.filter((num) => num !== numberSelected)
      );
    }, 1000);
    setTimeoutIds((prevTimeoutId) => [...prevTimeoutId, newTimeoutId]);
  };
  // Hàm restart
  const restartGame = () => {
    timeoutIds.forEach((id) => clearTimeout(id));
    handleClickBtn();
    setSelectedCircle(null);
    setHighlightedCircles([]);
    setMessage({ text: "", color: "" });
    setIsRunning(true); // Khởi động lại trò chơi
  };

  const handleClickBtn = () => {
    if (!points) {
      alert("Please enter the point");
      return;
    }
    setMessage({
      text: "",
      color: "",
    });
    setTime(0);
    setIsRunning(true);
    setStatusBtn(false);
    setTimeout(() => setStatusBtn(true), 0);

    //render các hình tròn số tăng dần đảm bảo các số bé luôn nằm trên số lớn trong view
    const newCircles = Array.from({ length: points }, (_, i) => {
      const randomLeft = Math.random() * 80;
      const randomTop = Math.random() * 80;
      return {
        number: i + 1,
        left: randomLeft + "%",
        top: randomTop + "%",
        active: true,
      };
    });
    setCircles1(newCircles);
    setCircles(newCircles);
  };

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="container d-flex justify-content-center py-5">
      <div className="container-fluid ">
        {message.text && (
          <div style={{ color: message.color }}>
            <h1>{message.text}</h1>
          </div>
        )}
        <div className="title">
          <h1>LET'S PLAY</h1>
        </div>
        <div className="input-points">
          <label className="form-label">Points: </label>
          <input
            type="number"
            min={0}
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="time-line">
          <label className="form-label">Time: </label>
          <span className="time-count">{time.toFixed(1)}s</span>
        </div>
        <input
          type="button"
          value={statusBtn ? "Restart" : "Start"}
          onClick={statusBtn ? restartGame : handleClickBtn}
        />
        <div className="view mt-3 position-relative">
          {circles1.map(
            (circle, index) =>
              circle.active && (
                <div
                  key={index}
                  className={`circle ${
                    selectedCircle === circle.number ? "red" : ""
                  }`}
                  style={{
                    backgroundColor: highlightedCircles.includes(circle.number)
                      ? "red"
                      : "white",
                    position: "absolute",
                    left: circle.left,
                    top: circle.top,
                    zIndex: points - circle.number,
                  }}
                  onClick={() => pickNumber(circle.number)}
                >
                  {circle.number}
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
