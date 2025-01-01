import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

function HomePage() {
  const [message, setMessage] = useState('SoulSync'); // Default to "SoulSync"
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch data from the backend API
    axios.get('http://localhost:8080')
      .then((response) => {
        if (response.data.message) {
          setMessage(response.data.message); // Update message if API responds correctly
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(true); // Set error state to true on failure
      });
  }, []);

  return (
    <>
      <div
        className="home-page"
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, lavender, lightsteelblue)',
          color: '#333',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          flexDirection: 'column',
        }}
      >
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }}>
          {error ? 'SoulSync' : message}
        </h1>
        <Link to="/skills">
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#7E57C2',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Go to Skills
          </button>
        </Link>
        
        {/* New Game Button */}
        <Link to="/games">
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#FF4081',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Go to Games
          </button>
        </Link>
      </div>
    </>
  );
}

export default HomePage;
