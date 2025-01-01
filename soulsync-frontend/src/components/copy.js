import React, { useState, useEffect, useRef } from 'react';

const BreathingGame = () => {
  const [phase, setPhase] = useState('');
  const [animationStyle, setAnimationStyle] = useState({});
  const [timeLeft, setTimeLeft] = useState(4); // Initialize with 4 seconds
  const [isActive, setIsActive] = useState(false);

  const phases = [
    { name: 'Inhale', duration: 4000, scale: 2 },
    { name: 'Hold', duration: 4000, scale: 2 },
    { name: 'Exhale', duration: 4000, scale: 1 },
    { name: 'Hold', duration: 4000, scale: 1 },
  ];

  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const phaseIndexRef = useRef(0); // Keep track of the current phase index across renders
  const currentTimerRef = useRef(4); // Variable to keep track of the current timer value

  const [meditationVoice, setMeditationVoice] = useState(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Function to choose a consistent voice for meditation
  const speak = (text) => {
    if (!meditationVoice) return; // Don't speak if the voice isn't set yet

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = meditationVoice;

    // Adjust voice properties for meditation
    utterance.pitch = 0.5;  // Lower pitch for a soothing voice
    utterance.rate = 0.8;   // Slow speech rate for calmness
    utterance.volume = 1;   // Set volume to maximum

    // Speak the text
    speechSynthesis.speak(utterance);
  };

  // Wait for voices to load and then select the meditation voice
  const loadVoice = () => {
    const voices = speechSynthesis.getVoices();

    // Check if the voices are loaded, and find the meditation voice
    const selectedVoice = voices.find(
      voice => voice.name.toLowerCase().includes('zira') || voice.name.toLowerCase().includes('male')
    );

    if (selectedVoice) {
      setMeditationVoice(selectedVoice); // Store the selected meditation voice
      setVoicesLoaded(true); // Set voicesLoaded to true once the voice is loaded
    }
  };

  // Reset timer function
  const resetTimer = () => {
    clearInterval(timerRef.current); // Clear any existing timer
    currentTimerRef.current = 4; // Reset the timer value to 4
    setTimeLeft(currentTimerRef.current); // Update the state with the new time
  };

  // Start the breathing game
  const startBreathing = () => {
    if (isActive || !voicesLoaded) return; // Prevent start if already active or voices are not loaded

    setIsActive(true);
    phaseIndexRef.current = 0; // Reset the phase index at the start
    resetTimer(); // Ensure the timeLeft is reset to 4 at the start

    const updatePhase = () => {
      const { name, scale, duration } = phases[phaseIndexRef.current];
      setPhase(name);
      setAnimationStyle({
        transform: `scale(${scale})`,
        transition: `transform ${duration / 1000}s ease-in-out`,
      });

      // Announce the phase
      speak(name);

      // Set the countdown timer for each phase
      startCountdown(duration);

      // Move to the next phase
      phaseIndexRef.current = (phaseIndexRef.current + 1) % phases.length;
    };

    // Start countdown function
    const startCountdown = (duration) => {
      resetTimer(); // Reset timer before starting the countdown

      timerRef.current = setInterval(() => {
        console.log('Previous Time:', currentTimerRef.current); // Log the previous time value

        // Update the timer variable and state
        if (currentTimerRef.current <= 1) {
          clearInterval(timerRef.current); // Stop the timer when it reaches 0
          currentTimerRef.current = 0;
          setTimeLeft(currentTimerRef.current);
        } else {
          currentTimerRef.current -= 1;
          setTimeLeft(currentTimerRef.current);
        }
      }, 1000);
    };

    // Start the first phase immediately
    updatePhase();

    // Start the phase cycling interval to trigger the next phase
    intervalRef.current = setInterval(() => {
      updatePhase();
    }, 4000);
  };

  // Stop the breathing game
  const stopBreathing = () => {
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);
    setIsActive(false);
    setPhase('');
    setAnimationStyle({
      transform: 'scale(1)',
      transition: 'transform 0.5s ease-in-out',
    });
    resetTimer(); // Reset timer when stopped
  };

  useEffect(() => {
    // Ensure voices are loaded when the component mounts
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoice; // Use this event to check when voices are loaded
    } else {
      loadVoice(); // In case the voices are already loaded
    }
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
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
        background: 'black',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#D1C4E9',
          ...animationStyle,
          position: 'relative',
          zIndex: 2, // Ensure the circle stays on top of the background
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '30px',
            color: '#5C4B51',
            zIndex: 2, // Text on top of the circle
          }}
        >
          {timeLeft}
        </div>
      </div>
      <p style={{ fontSize: '20px', color: '#D1C4E9', margin: '10px 0', zIndex: 2 }}>
        {phase || 'Click Start to Begin'}
      </p>
      <button
        onClick={startBreathing}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#7E57C2',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '5px',
          zIndex: 2,
        }}
      >
        Start
      </button>
      <button
        onClick={stopBreathing}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#B39DDB',
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

      {/* Night Sky with Glowing Stars */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          background: 'black',
          overflow: 'hidden',
        }}
      >
        <div className="stars" style={starryBackgroundStyles}></div>
      </div>
    </div>
  );
};

const starryBackgroundStyles = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  background: 'radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)',
  animation: 'twinkle 1s infinite alternate',
  pointerEvents: 'none',
  boxShadow: '0 0 15px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.1)',
};

const glowAnimation = `
  @keyframes twinkle {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }
`;

document.styleSheets[0].insertRule(glowAnimation, 0); // Inject twinkling animation into the stylesheet

export default BreathingGame;
