import { GoogleGenerativeAI } from "@google/generative-ai";
import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Key_metrics from "../assets/Key_metrics.png";
import axios from "../axios";
const Suggestions = () => {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateForecastPrompt = useCallback((actualData) => {
    return `You are a JSON-only response API. Do not include any markdown formatting, code blocks, or additional text. Analyze this monthly spending data and output a single JSON object:

${JSON.stringify(actualData, null, 2)}

Output a single JSON object with these exact keys:
{
  "topCategories": ["category1", "category2", "category3"],
  "monthOverMonthGrowth": "+/-XX%",
  "nextMonthPrediction": XXXX,
  "anomalies": ["brief description", "brief description"],
  "optimizationSuggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "seasonalPatterns": "brief description",
  "averageBurnRate": XXXX
}

Keep all text descriptions under 15 words. Use only numbers and strings in the response.`;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/getPredictiveSpendingInsights", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.data?.monthlyData) {
          throw new Error("Invalid response format");
        }

        const actualData = response.data.monthlyData;
        const genAI = new GoogleGenerativeAI(
          import.meta.env.VITE_GENAI_API_KEY
        );
        const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(
          generateForecastPrompt(actualData)
        );

        // Clean the response text by removing any possible markdown or code blocks
        const cleanedText = result.response
          .text()
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        setSuggestions(JSON.parse(cleanedText));
      } catch (error) {
        console.error("Error in PredictiveSpending:", error);
        setError("Failed to load spending insights");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [generateForecastPrompt]);

  if (loading) {
    return (
      <div className="p-6 w-1/3 bg-[#04071D]  bg-opacity-60 rounded-2xl border-2 border-[#161A31]">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (!suggestions) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics Card */}
      <div className="bg-[#04071D]  bg-opacity-60 rounded-2xl border-2 border-[#161A31]  shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <img width={35} src={Key_metrics} alt="key-metrics" />
            Key Metrics
          </h2>
        </div>

        <div className="grid md:grid-cols-2 text-start gap-4">
          <div>
            <h3 className="text-md font-medium text-gray-500">
              Top Categories
            </h3>
            <ul className="mt-2 space-y-1 flex text-start flex-col">
              {suggestions.topCategories.map((category, index) => (
                <li key={index} className="text-sm">
                  {index + 1}. {category}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-500">
              Growth & Predictions
            </h3>
            <div className="mt-2 space-y-1 flex text-start flex-col">
              <p className="text-sm flex items-center">
                <span
                  className={
                    suggestions.monthOverMonthGrowth.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {suggestions.monthOverMonthGrowth.startsWith("+") ? (
                    <ArrowUp width={20} />
                  ) : (
                    <ArrowDown width={20} />
                  )}
                </span>
                MoM Growth: {suggestions.monthOverMonthGrowth}
              </p>
              <p className="text-sm">
                <span role="img" aria-label="prediction">
                  🎯
                </span>{" "}
                Next Month: ₹{suggestions.nextMonthPrediction.toLocaleString()}
              </p>
              <p className="text-sm">
                <span role="img" aria-label="money">
                  💰
                </span>{" "}
                Avg Burn Rate: ₹{suggestions.averageBurnRate.toLocaleString()}
                /month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Card */}
      <div className="bg-[#04071D]  bg-opacity-60 rounded-2xl border-2 border-[#161A31]  shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span role="img" aria-label="insights">
              💡
            </span>
            Insights & Recommendations
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Anomalies</h3>
            <ul className="mt-2 space-y-1">
              {suggestions.anomalies.map((anomaly, index) => (
                <li key={index} className="text-sm">
                  <span role="img" aria-label="alert">
                    ⚠️
                  </span>{" "}
                  {anomaly}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Optimization Suggestions
            </h3>
            <ul className="mt-2 space-y-1">
              {suggestions.optimizationSuggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">
                  <span role="img" aria-label="suggestion">
                    ✨
                  </span>{" "}
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Seasonal Patterns
            </h3>
            <p className="mt-2 text-sm">
              <span role="img" aria-label="calendar">
                📅
              </span>{" "}
              {suggestions.seasonalPatterns}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
