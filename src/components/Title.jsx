import React from "react";
import "./Title.css"; // Import CSS for styles

export default function Title() {
    const colors = ["blue", "orange", "purple", "green", "red"];
    const title = "CRUSHR".split("");  // Split the word into individual characters
  
    return (
      <div className="signup-title-container">
        <h1 className="signup-title">
          {title.map((char, index) => (
            <span
              key={index}
              className={`letter ${colors[index % colors.length]}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>
    );
  }