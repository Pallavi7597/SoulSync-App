import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import GamesPage from './components/GamesPage';
import BreathingGame from './components/BreathingGame'; // Import the Breathing Game component
import MoodQuest from './components/MoodQuest'; // Import the MoodQuest component

function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes and specify components as elements */}
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/breathing-game" element={<BreathingGame />} />
        <Route path="/moodquest" element={<MoodQuest />} />
        {/* Add more routes for additional games here */}
      </Routes>
    </Router>
  );
}

export default App;
