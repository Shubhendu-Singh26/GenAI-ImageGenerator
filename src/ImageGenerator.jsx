import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import axios from 'axios';

const ImageGenerator = () => {
  const [content, setContent] = useState('Generate images to view it here');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); 
  const inputRef = useRef(null);

  const imageGenerator = async () => {
    const inputText = inputRef.current.value.trim();
    if (inputText === "") {
      alert("Please enter a description.");
      return;
    }

    setLoading(true);
    setContent(""); 
    setProgress(0); 

    const token =  import.meta.env.VITE_API_TOKEN; 

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + 10; 
        return prev;
      });
    }, 500);

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        { inputs: inputText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob', 
        }
      );

      clearInterval(interval); 

      const imageBlob = response.data;
      const objectURL = URL.createObjectURL(imageBlob);

      setContent(
        <img src={objectURL} alt="Generated AI" className="generated-image" />
      );
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
      setContent("Generate images to view it here");
    } finally {
      setLoading(false); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      imageGenerator();
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        <span className="glow">AI</span> Image <span>Generator</span>
      </div>

      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want to see"
          onKeyDown={handleKeyDown}  
        />
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>

      <div className="loading">
        {loading && (
          <>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="loading-text">Generating Image... {progress}%</div>
          </>
        )}
      </div>

      <div className="content-display">
        {content ? (
          typeof content === 'string' ? (
            <p className="placeholder-text">{content}</p>
          ) : (
            content
          )
        ) : (
          <p className="placeholder-text">Generate images to view it here</p>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
