import React, { useEffect, useState } from "react";
const WordByWordText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const words = text.split(" ");

  useEffect(() => {
    let wordIndex = 0;

    const interval = setInterval(() => {
      setDisplayedText(
        (prevText) => prevText + (wordIndex > 0 ? " " : "") + words[wordIndex]
      );
      wordIndex++;

      if (wordIndex >= words.length) {
        clearInterval(interval);
      }
    }, 300); // Adjust the delay as needed (in milliseconds)

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default WordByWordText;
