import React from 'react';
import { Link } from 'react-router-dom';

function GamesPage() {
  const motivationalQuotes = [
    "Take it one day at a time. You are doing great!",
    "Believe in yourself, and you're halfway there.",
    "You are enough, just as you are.",
    "Every step forward, no matter how small, is progress.",
    "Mental health is just as important as physical health. Take care of yourself.",
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f0e6f6, #d7c1e4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px',
        height: '100vh', // Ensure it takes full viewport height
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      <h2 style={{ fontSize: '3.5rem', color: '#7E57C2', marginBottom: '20px' }}>
        🌟 Explore Your Mental Health Journey Through Play 🌟
      </h2>
      <p
        style={{
          fontSize: '1.2rem',
          color: '#555',
          marginTop: '10px',
          fontStyle: 'italic',
          maxWidth: '600px',
        }}
      >
        {randomQuote}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: '30px',
          flexWrap: 'wrap',
        }}
      >
        <Link to="/breathing-game">
          <button
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#7E57C2',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '20px',
              width: '200px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              margin: '10px',
            }}
          >
            🧘‍♂️ Breathing Game
          </button>
        </Link>

        <Link to="/moodquest">
          <button
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#7E57C2',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '20px',
              width: '200px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              margin: '10px',
            }}
          >
            🎮 MoodQuest
          </button>
        </Link>
      </div>

      {/* Game Tips Section */}
      <div
        style={{
          marginTop: '50px',
          padding: '10px 20px',
          backgroundColor: '#7E57C2',
          color: '#fff',
          borderRadius: '10px',
          fontSize: '18px',
          maxWidth: '500px',
          marginBottom: '10px',
        }}
      >
        <p>🎉 Tips for Today:</p>
        <p>
          - Take breaks throughout your day and check in with how you’re feeling.
          - Practice deep breathing or mindfulness for a few minutes today.
          - Share something you’re grateful for to improve your mood!
        </p>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: 'absolute',
          bottom: '20px',
          width: '100%',
          textAlign: 'center',
          fontSize: '14px',
          color: '#888',
        }}
      >
        <p>🧡 Remember, your mental health matters! 💙</p>
      </footer>
    </div>
  );
}

export default GamesPage;
