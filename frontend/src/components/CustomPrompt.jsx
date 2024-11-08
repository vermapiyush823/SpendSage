import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useEffect, useState } from "react";
import axios from "../axios";

const CustomPrompt = () => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePromptChange = (e) => setCustomPrompt(e.target.value);

  const fetchActualData = async () => {
    try {
      const response = await axios.get("/getPredictiveSpendingInsights", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.monthlyData;
    } catch (error) {
      console.error("Error fetching spending data:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setDisplayedText(""); // Reset displayed text

    try {
      const actualData = await fetchActualData();
      const combinedPrompt = `
        ${customPrompt} 
        Here's the user's actual spending data for reference:
        ${JSON.stringify(actualData, null, 2)}
      `;

      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GENAI_API_KEY);
      const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(combinedPrompt);

      const cleanedText = result.response
        .text()
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      setResponse(cleanedText);
    } catch (error) {
      setError("Failed to fetch response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response) {
      let index = 0;
      const words = response.split(" ");
      const intervalId = setInterval(() => {
        setDisplayedText(
          (prev) => prev + (index === 0 ? "" : " ") + words[index]
        );
        index++;
        if (index === words.length) clearInterval(intervalId);
      }, 500); // Adjust speed (100ms) as desired
    }
  }, [response]);

  return (
    <div className="p-4">
      <div className="space-y-4">
        <h1 className="block text-white text-bold text-xl">
          Ask a Custom Prompt
        </h1>
        <textarea
          value={customPrompt}
          onChange={handlePromptChange}
          rows={1}
          className="p-2 rounded w-full
            bg-gray-900 text-white focus:outline-none border-2 border-[#161A31]
          "
          placeholder="Type your prompt here..."
        />
        <button
          onClick={handleSubmit}
          disabled={!customPrompt || loading}
          className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Submit Prompt"}
        </button>
      </div>
      <div className="p-4 w-full mt-5 bg-[#04071D] bg-opacity-60 rounded-lg border-2 border-[#161A31]">
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {displayedText && (
          <div className="flex p-4 rounded-lg">
            <pre className="text-sm text-white text-wrap break-words overflow-auto w-full mt-2 bg-gray-900 p-2 rounded-lg">
              {displayedText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPrompt;
