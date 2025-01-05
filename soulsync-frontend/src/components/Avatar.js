import React from 'react';

const Avatar = ({ isSpeaking }) => {
  return (
    <div className="avatar">
      <svg
        width="150"
        height="150"
        viewBox="0 0 150 150"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Face */}
        <circle cx="75" cy="75" r="70" fill="#FFD1A4" stroke="#000" strokeWidth="2" />
        
        {/* Eyes */}
        <circle cx="55" cy="60" r="8" fill="#000" />
        <circle cx="95" cy="60" r="8" fill="#000" />
        
        {/* Mouth */}
        {isSpeaking ? (
          // Speaking state: open mouth
          <ellipse cx="75" cy="95" rx="20" ry="10" fill="#000" />
        ) : (
          // Default state: smile
          <path
            d="M55 95 Q75 115 95 95"
            stroke="#000"
            strokeWidth="3"
            fill="none"
          />
        )}
        
        {/* Eyebrows */}
        <line
          x1="45"
          y1="45"
          x2="65"
          y2="50"
          stroke="#000"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="85"
          y1="50"
          x2="105"
          y2="45"
          stroke="#000"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Avatar;
