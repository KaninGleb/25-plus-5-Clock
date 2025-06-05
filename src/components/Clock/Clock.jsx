import { useState, useRef, useEffect } from 'react'
import s from './Clock.module.css'

export const Clock = () => {
  const [breakLength, setBreakLength] = useState(5)
  const [sessionLength, setSessionLength] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [timerRunning, setTimerRunning] = useState(false)
  const [sessionActive, setSessionActive] = useState(true)

  const audioRef = useRef(null)
  const timerRef = useRef(null)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  const reset = () => {
    clearInterval(timerRef.current)
    setBreakLength(5)
    setSessionLength(25)
    setTimeLeft(25 * 60)
    setTimerRunning(false)
    setSessionActive(true)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const decrementBreak = () => {
    if (breakLength > 1) {
      setBreakLength((prev) => prev - 1)
    }
  }

  const incrementBreak = () => {
    if (breakLength < 60) {
      setBreakLength((prev) => prev + 1)
    }
  }

  const decrementSession = () => {
    if (sessionLength > 1) {
      setSessionLength((prev) => prev - 1)
      if (!timerRunning) {
        setTimeLeft((sessionLength - 1) * 60)
      }
    }
  }

  const incrementSession = () => {
    if (sessionLength < 60) {
      setSessionLength((prev) => prev + 1)
      if (!timerRunning) {
        setTimeLeft((sessionLength + 1) * 60)
      }
    }
  }

  const toggleTimer = () => {
    setTimerRunning((prev) => !prev)
  }

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            if (sessionActive) {
              setSessionActive(false)
              return breakLength * 60
            } else {
              setSessionActive(true)
              return sessionLength * 60
            }
          }
          if (prev === 1) {
            if (audioRef.current) {
              audioRef.current.play()
            }
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [timerRunning, breakLength, sessionLength, sessionActive])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
    }
  }, [])

  return (
    <div className={s.pomodoroClock}>
      <h1>Pomodoro Clock</h1>

      <div className={s.lengthControls}>
        <div className={s.breakControl} id="break-control">
          <div id="break-label">Break Length</div>
          <button id="break-decrement" onClick={decrementBreak}>
            -
          </button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={incrementBreak}>
            +
          </button>
        </div>

        <div className={s.sessionControl} id="session-control">
          <div id="session-label">Session Length</div>
          <button id="session-decrement" onClick={decrementSession}>
            -
          </button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={incrementSession}>
            +
          </button>
        </div>
      </div>

      <div className={s.timer}>
        <div id="timer-label">{sessionActive ? 'Session' : 'Break'}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>

      <div className={s.timerControls}>
        <button id="start_stop" onClick={toggleTimer}>
          {timerRunning ? 'Pause' : 'Start'}
        </button>
        <button id="reset" onClick={reset}>
          Reset
        </button>
      </div>

      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  )
}
