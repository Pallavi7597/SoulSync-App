import React from "react";
import { useNavigate } from "react-router-dom";

const issues = [
  { id: "depression", name: "Depression", image: "/depression.jpg" },
  { id: "anxiety", name: "Anxiety", image: "/anxiety.jpg" },
  { id: "ptsd", name: "PTSD (Post-Traumatic Stress Disorder)", image: "/PTSD.jpg" },
  { id: "ocd", name: "OCD (Obsessive-Compulsive Disorder)", image: "/OCD.png" },
  { id: "bipolar", name: "Bipolar Disorder", image: "/bipolar.jpg" },
  { id: "loneliness", name: "Loneliness", image: "/Loneliness.jpg" },
  { id: "eating", name: "Eating Disorders", image: "/eating.png" },
  { id: "addiction", name: "Addiction", image: "/Addiction.png" },
  { id: "grief", name: "Grief and Loss", image: "/Grief.jpg" },
];

const MentalHealthIssuesPage = () => {
  const navigate = useNavigate();

  const handleIssueClick = (issueId) => {
    navigate(`/chat/${issueId}`);
  };

  return (
    <div className="issues-page">
      <h1 className="title">Mental Health Support</h1>
      <p className="description">
        Choose a mental health issue to get started on your journey toward healing and support.
      </p>
      <div className="issues-list">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="issue-item"
            onClick={() => handleIssueClick(issue.id)}
          >
            <div className="image-container">
              <img src={issue.image} alt={issue.name} className="issue-image" />
            </div>
            <h2>{issue.name}</h2>
          </div>
        ))}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #f8d9e6, #e0bbe4); /* Soft gradient from baby pink to light purple */
          color: #333;
          overflow-x: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .issues-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          height: 100%;
          padding-top: 30px;
          text-align: center;
          flex-grow: 1;
          overflow-y: auto;
        }

        .title {
          font-size: 3.5rem;
          color: #6b4f97; /* Purple color for the heading */
          margin-bottom: 20px;
          font-weight: bold;
          text-transform: uppercase;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
          padding-left: 15px;
          padding-right: 15px;
          word-wrap: break-word;
        }

        .description {
          font-size: 1.3rem;
          color: #b87f9c; /* Dark Peach color for the subheading */
          margin-bottom: 40px;
          width: 80%;
          max-width: 800px;
          line-height: 1.6;
        }

        .issues-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* 3 items per row */
          gap: 20px;
          width: 90%;
          max-width: 1200px;
          margin-top: 30px;
          margin-bottom: 50px;
        }

        /* Mobile responsiveness */
        @media (max-width: 900px) {
          .issues-list {
            grid-template-columns: repeat(2, 1fr); /* 2 items per row on smaller screens */
          }
        }

        @media (max-width: 600px) {
          .issues-list {
            grid-template-columns: 1fr; /* 1 item per row on very small screens */
          }
        }

        .issue-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid #e0bbe4; /* Light purple border around the issue item */
          border-radius: 12px;
          padding: 18px;
          background-color: #f8d9e6; /* Light pinkish background */
          box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
          width: 280px; /* Slightly bigger box width */
          height: 280px; /* Slightly bigger box height */
          justify-content: space-evenly; /* Space for image and text */
        }

        .issue-item:hover {
          transform: translateY(-8px); /* Subtle lift on hover */
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .issue-item:active {
          transform: translateY(2px); /* Slight depression effect on click */
        }

        .image-container {
          background-color: #f8d9e6; /* Ensure the same baby pink background behind the image */
          padding: 15px;
          border-radius: 50%;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
        }

        .issue-image {
          width: 110px;
          height: 110px;
          object-fit: cover;
          border-radius: 50%; /* Circular image */
        }

        .issue-item h2 {
          font-size: 1.3rem;
          color: #6b4f97; /* Purple color for the text */
          font-weight: bold;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default MentalHealthIssuesPage;
