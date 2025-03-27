import React from "react";
import "./Title.css"; // Import CSS for styles
import crushr from "../assets/Crushr.png"


export default function Title() {
    const colors = ["blue", "orange", "purple", "green", "red"];
    const title = "CRUSHR".split("");  // Split the word into individual characters
  
    return (
      <div className="signup-title-container">
        <h1 className="signup-title">
          <img src={crushr}
          alt={"CRUSHR"}
          style={{ width: '200px', height: '200px' }}/>
        </h1>
      </div>
    );
  }