import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "../../axios";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Constants
const CHART_COLORS = {
  actual: {
    border: "#3b82f6",
    background: "rgba(59, 130, 246, 0.5)",
  },
  forecast: {
    border: "#ec4899",
    background: "rgba(236, 72, 153, 0.5)",
  },
};

const PredictiveSpending = () => {
  // State management
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  function getMonthValue(month) {
    switch (month) {
      case 1:
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Apr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Aug";
      case 9:
        return "Sep";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
      default:
        return "";
    }
  }
  // Memoized chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: { color: "#9ca3af" },
        },
      },
      scales: {
        x: {
          ticks: { color: "#9ca3af", font: { family: "Poppins", size: 12 } },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#9ca3af", font: { family: "Poppins", size: 12 } },
          grid: { display: false },
        },
      },
    }),
    []
  );

  // Helper functions
  const calculateTotalSpending = useCallback((data) => {
    if (!data?.data) return 0;
    return Object.values(data.data).reduce(
      (acc, value) => acc + (typeof value === "number" ? value : 0),
      0
    );
  }, []);

  const generateForecastPrompt = useCallback((actualData) => {
    return `
      Provide a forecast for the monthly spending for the remaining months in the current year, based on the provided historical monthly spending data. 
      
      The input data is in the following format:
      ${JSON.stringify(actualData, null, 2)}
      
      Please generate the forecast in the same format as the input data, maintaining:
      1. The same monthly data structure
      2. Similar spending categories per month
      3. Continuous trends from the historical data
      4. Seasonal patterns if present
      
      Consider:
      - Historical spending patterns
      - Month-over-month growth rates
      - Seasonal variations
      - Any apparent trends in the data
      
      Return only the JSON forecast data without any additional explanation.
    `;
  }, []);

  const buildChartData = useCallback(
    (actualData, forecastData) => {
      // Get unique months from both datasets
      const allMonths = [
        ...new Set([
          ...actualData.map((d) => d.month),
          ...forecastData.map((d) => d.month),
        ]),
      ].sort();

      // Calculate values for actual and forecast data
      const actualValues = actualData.map(calculateTotalSpending);

      // Process forecast values with null for past months
      let forecastValues = allMonths.map((month) => {
        const forecastPoint = forecastData.find((d) => d.month === month);
        return forecastPoint ? calculateTotalSpending(forecastPoint) : null;
      });

      // Align the last actual value with forecast
      const lastActualMonth = actualData[actualData.length - 1].month;
      const lastActualMonthIndex = allMonths.indexOf(lastActualMonth);
      if (lastActualMonthIndex !== -1) {
        forecastValues[lastActualMonthIndex] =
          actualValues[actualData.length - 1];
      }

      return {
        labels: allMonths.map((month) =>
          getMonthValue(Number(month.split("-")[1]))
        ),

        datasets: [
          {
            label: "Actual Spending",
            data: actualValues,
            fill: false,
            borderColor: CHART_COLORS.actual.border,
            backgroundColor: CHART_COLORS.actual.background,
            tension: 0.3,
          },
          {
            label: "Forecast",
            data: forecastValues,
            fill: false,
            borderDash: [3, 3],
            borderColor: CHART_COLORS.forecast.border,
            backgroundColor: CHART_COLORS.forecast.background,
            tension: 0.3,
            spanGaps: true,
          },
        ],
      };
    },
    [calculateTotalSpending]
  );

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch actual data
        const response = await axios.get("/getPredictiveSpendingInsights", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.data?.monthlyData) {
          throw new Error("Invalid response format");
        }

        const actualData = response.data.monthlyData;

        // Generate forecast
        const genAI = new GoogleGenerativeAI(
          import.meta.env.VITE_GENAI_API_KEY
        );
        const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(
          generateForecastPrompt(actualData)
        );
        const forecastData = JSON.parse(await result.response.text());

        // Process and set chart data
        setChartData(buildChartData(actualData, forecastData));
      } catch (error) {
        console.error("Error in PredictiveSpending:", error);
        setError(error.message || "Failed to fetch or process data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [buildChartData, generateForecastPrompt]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-2/3 p-5 bg-[#04071D] min-h-[400px] rounded-2xl border-2 border-[#161A31]">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  // Main render
  return (
    <div className="w-2/3 px-5 pt-10 bg-[#04071D]  bg-opacity-60 rounded-2xl border-2 border-[#161A31]">
      <h2 className="text-xl font-bold mb-4 text-center text-white">
        Spending Forecast
      </h2>
      {chartData.labels.length > 0 ? (
        <div className="w-full align-bottom">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="text-gray-300">No data available</div>
      )}
    </div>
  );
};

export default PredictiveSpending;
