import React, { useState, useEffect, useRef } from 'react';

const BreathingGame = () => {
  const [phase, setPhase] = useState('');
  const [animationStyle, setAnimationStyle] = useState({});
  const [timeLeft, setTimeLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [totalTimer, setTotalTimer] = useState(128); // Timer in seconds (2 minutes 8 seconds)
  const [meditationVoice, setMeditationVoice] = useState(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const backgroundAudio = useRef(null);
  const stopButtonRef = useRef(null); // Reference for the stop button

  const phases = [
    { name: 'Inhale', duration: 4000, scale: 2 },
    { name: 'Hold', duration: 4000, scale: 2 },
    { name: 'Exhale', duration: 4000, scale: 1 },
    { name: 'Hold', duration: 4000, scale: 1 },
  ];

  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const phaseIndexRef = useRef(0);
  const currentTimerRef = useRef(4);
  const totalTimerRef = useRef(128);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const speak = (text) => {
    if (!meditationVoice) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = meditationVoice;
    utterance.pitch = 0.5;
    utterance.rate = 0.8;
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
  };

  const loadVoice = () => {
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(
      (voice) =>
        voice.name.toLowerCase().includes('google uk english female') ||
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('soothing')
    );

    if (selectedVoice) {
      setMeditationVoice(selectedVoice);
      setVoicesLoaded(true);
    }
  };

  const startBreathing = () => {
    if (isActive || !voicesLoaded) return;

    setIsActive(true);
    phaseIndexRef.current = 0;
    resetTimer();
    resetTotalTimer();

    backgroundAudio.current.play();

    const updatePhase = () => {
      const { name, scale, duration } = phases[phaseIndexRef.current];
      setPhase(name);
      setAnimationStyle({
        transform: `scale(${scale})`,
        transition: `transform ${duration / 1000}s ease-in-out`,
      });

      speak(name);
      startCountdown(duration);
      phaseIndexRef.current = (phaseIndexRef.current + 1) % phases.length;
    };

    const startCountdown = (duration) => {
      resetTimer();

      timerRef.current = setInterval(() => {
        if (currentTimerRef.current <= 1) {
          clearInterval(timerRef.current);
          currentTimerRef.current = 0;
          setTimeLeft(currentTimerRef.current);
        } else {
          currentTimerRef.current -= 1;
          setTimeLeft(currentTimerRef.current);
        }
      }, 1000);
    };

    totalTimerRef.current = setInterval(() => {
      if (totalTimer === 1) {
        clearInterval(totalTimerRef.current);
        setTotalTimer(0);
      } else {
        setTotalTimer((prev) => Math.max(prev - 1, 0)); // Prevent going below 0
      }
    }, 1000);

    updatePhase();

    intervalRef.current = setInterval(() => {
      if (totalTimer === 0) {
        clearInterval(intervalRef.current); // Stop the phases
        stopBreathing(); // Stop the breathing when totalTimer is 0
      } else {
        updatePhase();
      }
    }, 4000);
  };

  const stopBreathing = () => {
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);
    clearInterval(totalTimerRef.current);

    backgroundAudio.current.pause();
    backgroundAudio.current.currentTime = 0;

    setIsActive(false);
    setPhase('');
    setAnimationStyle({
      transform: 'scale(1)',
      transition: 'transform 0.5s ease-in-out',
    });

    resetTimer();
    resetTotalTimer();
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    currentTimerRef.current = 4;
    setTimeLeft(currentTimerRef.current);
  };

  const resetTotalTimer = () => {
    clearInterval(totalTimerRef.current);
    totalTimerRef.current = 128;
    setTotalTimer(totalTimerRef.current);
  };

  // Automatically click the stop button when the totalTimer hits 0
  useEffect(() => {
    if (totalTimer === 0) {
      stopBreathing(); // Trigger stopBreathing directly
    }
  }, [totalTimer]);

  useEffect(() => {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoice;
    } else {
      loadVoice();
    }
  }, []);

  useEffect(() => {
    backgroundAudio.current = new Audio('/soothing-music.mp3');
    backgroundAudio.current.loop = true;
    backgroundAudio.current.volume = 0.2; // Set a low volume for the background music

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
      clearInterval(totalTimerRef.current);
      if (backgroundAudio.current) {
        backgroundAudio.current.pause();
        backgroundAudio.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          fontSize: '25px',
          fontWeight: 'bold',
          color: '#fff',
          position: 'absolute',
          top: '20px',
          zIndex: 2,
        }}
      >
        {formatTime(totalTimer)}
      </div>
      <div
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          backgroundColor: '#8fbc8f',
          ...animationStyle,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '30px',
            color: '#fff',
            zIndex: 2,
          }}
        >
          {timeLeft}
        </div>
      </div>
      <p
        style={{
          fontSize: '26px',
          fontWeight: 'bolder',
          color: '#a0522d',
          margin: '10px 0px',
          marginTop: '80px',
          zIndex: 2,
        }}
      >
        {phase || 'Click Start to Begin'}
      </p>
      <button
        onClick={startBreathing}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#8fbc8f',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '5px',
          marginTop: '20px',
          zIndex: 2,
        }}
      >
        Start
      </button>
      <button
        ref={stopButtonRef} // Reference for the stop button
        onClick={stopBreathing}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#8fbc8f',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '5px',
          zIndex: 2,
        }}
      >
        Stop
      </button>
    </div>
  );
};

export default BreathingGame;
