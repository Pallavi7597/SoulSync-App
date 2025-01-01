import React, { useState } from 'react';

function MoodQuest() {
  const [mood, setMood] = useState('');
  const [reflection, setReflection] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [gratitudeHistory, setGratitudeHistory] = useState([]);

  const affirmations = [
    "You are capable of handling whatever comes your way.",
    "You are worthy of love and respect.",
    "Today is a new opportunity to grow and improve.",
    "You are stronger than you think.",
    "You are doing your best, and that's enough.",
  ];

  const handleMoodChange = (event) => setMood(event.target.value);
  const handleReflectionChange = (event) => setReflection(event.target.value);
  const handleGratitudeChange = (event) => setGratitude(event.target.value);

  const handleSubmit = () => {
    if (mood && reflection && gratitude) {
      setSubmitted(true);
      setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);

      // Save mood and gratitude to history
      setMoodHistory([...moodHistory, { mood, date: new Date().toLocaleDateString() }]);
      setGratitudeHistory([...gratitudeHistory, { gratitude, date: new Date().toLocaleDateString() }]);

      // Reset input fields
      setMood('');
      setReflection('');
      setGratitude('');
    } else {
      alert('Please fill all the fields.');
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f3f4f7', borderRadius: '8px' }}>
      <h2>Welcome to MoodQuest!</h2>
      <p>How are you feeling today?</p>
      <select
        value={mood}
        onChange={handleMoodChange}
        style={{ padding: '10px', fontSize: '16px' }}
      >
        <option value="">Select your mood</option>
        <option value="Happy">Happy</option>
        <option value="Sad">Sad</option>
        <option value="Stressed">Stressed</option>
        <option value="Calm">Calm</option>
        <option value="Excited">Excited</option>
        <option value="Anxious">Anxious</option>
      </select>

      <div style={{ marginTop: '20px' }}>
        <h3>Reflection</h3>
        <textarea
          value={reflection}
          onChange={handleReflectionChange}
          placeholder="What made you feel this way?"
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '100%',
            height: '100px',
          }}
        ></textarea>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Gratitude</h3>
        <textarea
          value={gratitude}
          onChange={handleGratitudeChange}
          placeholder="What are you grateful for today?"
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '100%',
            height: '100px',
          }}
        ></textarea>
      </div>

      <button
        onClick={handleSubmit}
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
        Submit
      </button>

      {submitted && (
        <div style={{ marginTop: '20px', fontWeight: 'bold', color: 'green' }}>
          <p>Thank you for sharing your thoughts!</p>
          <p style={{ fontStyle: 'italic' }}>{affirmation}</p>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3>Your Mood History</h3>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {moodHistory.map((entry, index) => (
            <li key={index}>
              {entry.date}: {entry.mood}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Your Gratitude History</h3>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {gratitudeHistory.map((entry, index) => (
            <li key={index}>
              {entry.date}: {entry.gratitude}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MoodQuest;

