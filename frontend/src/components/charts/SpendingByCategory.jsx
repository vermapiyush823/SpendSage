import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "../../axios"; // Assuming you are using axios for API requests
ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingByCategory = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState("monthly"); // Default view is Monthly
  const [month, setMonth] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}`
  );

  useEffect(() => {
    fetchChartData();
  }, [viewType, month]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/getSpending",
        {
          viewType,
          year: month.split("-")[0],
          month: month.split("-")[1],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data[0]; // Assuming it's an array with one object
      setLoading(false);
      setChartData(data);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching expenses:", err);
    }
  };

  // Prepare labels and dataset from the response
  const labels = ["Food", "Other", "Personal", "Shopping", "Travel"];
  const datasetValues = [
    chartData.food || 0,
    chartData.other || 0,
    chartData.personal || 0,
    chartData.shopping || 0,
    chartData.travel || 0,
  ];

  const data = {
    labels: labels,
    Title: "Spending by Category",
    datasets: [
      {
        label: `Spending by Category (${
          viewType === "monthly" ? "Monthly" : "Overall"
        })`,

        data: datasetValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],

        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      title: {
        display: true, // Enable the title
        text: `Spending by Category (${
          viewType === "monthly" ? month.split("-")[1] + "th month" : "Overall"
        })`, // Set your title text
        font: {
          size: 15, // Optional: Adjust the font size
          weight: "bold", // Optional: Adjust the font weight
        },
        color: "#CBACF9", // Set the color of the title text
      },
    },
  };

  return (
    <div className="h-[520px]   flex flex-col justify-center items-center bg-[#04071D] border-2 border-[#161A31] p-6 rounded-[30px] shadow-lg ">
      {loading ? (
        <div className="w-full p-5 bg-[#04071D] min-h-[400px] rounded-2xl ">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl text-white font-regular text-center mb-4">
            Spending By Category
          </h1>

          <div className="flex w-full">
            <div className="w-1/3 flex flex-col items-center gap-2">
              <button
                onClick={() => setViewType("overall")}
                className={`w-[150px]
          bg-gradient-to-r 

           px-4 py-2 rounded-lg 
                border-2 border-[#8A3FFC]
           ${
             viewType === "overall"
               ? "bg-[#8A3FFC] text-white"
               : "bg-white text-[#8A3FFC] border-2 border-[#8A3FFC]"
           } transition duration-200 ease-in-out`}
              >
                Overall View
              </button>
              <button
                onClick={() => setViewType("monthly")}
                className={`w-[150px] border-2 border-[#8A3FFC]
          ${
            viewType === "monthly"
              ? "bg-[#8A3FFC] text-white"
              : "bg-white text-[#8A3FFC] border-2 border-[#8A3FFC]"
          }  px-4 py-2 rounded-lg transition duration-200 ease-in-out`}
              >
                Monthly View
              </button>
              {viewType === "monthly" && (
                <div className="mb-4">
                  <label htmlFor="month-select">Select Month:</label>
                  <input
                    type="month"
                    id="month-select"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="ml-2 border-2 border-[#8A3FFC] rounded-lg p-2"
                  />
                </div>
              )}
            </div>
            <div className="w-2/3">
              <Pie data={data} options={options} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SpendingByCategory;
