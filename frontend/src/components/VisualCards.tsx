import React, { useState, useEffect } from 'react';

// 1. Define TypeScript Interface based on our MongoDB Schema
interface CardData {
  _id: string;
  word: string;
  definition: string;
  imageUrl: string;
  difficultyLevel: string;
}

const VisualCards: React.FC = () => {
  // State Management
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Fetch data from backend when the component loads
  useEffect(() => {
    fetchRandomCards();
  }, []);

  const fetchRandomCards = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure this URL matches your Express backend URL & Port
      const response = await fetch('http://localhost:5000/api/cards/random');
      if (!response.ok) throw new Error("Failed to fetch data");
      
      const data = await response.json();
      setCards(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not load vocabulary cards. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Audio Pronunciation Feature (Using Browser Native Speech Synthesis)
  const playAudio = (e: React.MouseEvent, wordToSpeak: string) => {
    e.stopPropagation(); // Prevents the card from flipping back over when clicking the button
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(wordToSpeak);
      utterance.lang = 'en-US'; // Set to American English
      utterance.rate = 0.9;     // Slightly slower for learners
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech!");
    }
  };

  // 4. Navigation Handlers
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleNextCard = () => {
    setIsFlipped(false); // Reset flip state for the next card
    
    // Wait for the flip animation to finish before changing the content
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Deck finished, fetch a new random batch and reset to index 0
        setCurrentIndex(0);
        fetchRandomCards();
      }
    }, 300); 
  };
