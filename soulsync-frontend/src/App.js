import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import GamesPage from './components/GamesPage';
import BreathingGame from './components/BreathingGame';
import MoodQuest from './components/MoodQuest';
import Chatbot from './components/Chatbot'; // Chat Page component
import MentalHealthIssuesPage from "./components/MentalHealthIssuesPage";
import GratitudeGarden from "./components/GratitideGarden";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes and specify components as elements */}
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/breathing-game" element={<BreathingGame />} />
        <Route path="/moodquest" element={<MoodQuest />} />
        <Route path="/chat/:issueId" element={<Chatbot />} /> {/* Chat feature route */}
        <Route path="/mentalhealthissue" element={<MentalHealthIssuesPage />} />
        <Route path="/gratitudegarden" element={<GratitudeGarden />} />
        
        {/* Redirect invalid routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
