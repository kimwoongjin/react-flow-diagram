/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

interface TimerProps {
  start: boolean;
  stop: boolean;
}

const Timer = ({ start, stop }: TimerProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: any;

    if (start && !stop) {
      setIsRunning(true);
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setIsRunning(false);
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [start, stop]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer">
      <span>
        {`${String(minutes).padStart(2, '0')} 분`} {`${String(seconds).padStart(2, '0')} 초 경과`}
      </span>
    </div>
  );
};

export default Timer;
