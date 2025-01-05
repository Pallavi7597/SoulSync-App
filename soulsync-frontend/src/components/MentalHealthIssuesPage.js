import React from "react";
import { useNavigate } from "react-router-dom";

const issues = [
  { id: "depression", name: "Depression" },
  { id: "anxiety", name: "Anxiety" },
  { id: "ptsd", name: "PTSD (Post-Traumatic Stress Disorder)" },
  { id: "ocd", name: "OCD (Obsessive-Compulsive Disorder)" },
  { id: "bipolar", name: "Bipolar Disorder" },
  { id: "loneliness", name: "Loneliness" },
  { id: "eating", name: "Eating Disorders" },
  { id: "addiction", name: "Addiction" },
  { id: "grief", name: "Grief and Loss" },
];

const MentalHealthIssuesPage = () => {
  const navigate = useNavigate();

  const handleIssueClick = (issueId) => {
    // Navigate to the chatbot page with the selected issue
    navigate(`/chat/${issueId}`);
  };

  return (
    <div className="issues-page">
      <h1>Choose a Mental Health Support</h1>
      <p className="description">
        Select a mental health issue you're experiencing to receive support and
        guidance.
      </p>
      <div className="issues-list">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="issue-item"
            onClick={() => handleIssueClick(issue.id)}
          >
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
          background: linear-gradient(135deg, #A1C4FD, #C2E9FB);
          color: #333;
        }

        .issues-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }

        h1 {
          font-size: 3rem;
          color: #6b4f97;
          margin-bottom: 20px;
          font-weight: bold;
        }

        .description {
          font-size: 1.2rem;
          color: #5f4b8b;
          margin-bottom: 30px;
          width: 70%;
          max-width: 600px;
          line-height: 1.5;
        }

        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 80%;
          max-width: 500px;
        }

        .issue-item {
          padding: 15px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 12px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.3s ease;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          font-size: 1.25rem;
          color: #6b4f97;
        }

        .issue-item:hover {
          background-color: #f3f3f3;
          transform: translateY(-3px);
        }

        .issue-item:active {
          transform: translateY(2px);
        }

        .issue-item h2 {
          margin: 0;
          font-size: 1.4rem;
        }
      `}</style>
    </div>
  );
};

export default MentalHealthIssuesPage;
