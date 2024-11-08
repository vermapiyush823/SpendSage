import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "../../axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StackedBarChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/categoryspendingovertime", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const months = response.data.map(
          (item) =>
            getMonthValue(Number(item.month.split("-")[1])) +
            " " +
            item.month.split("-")[0]
        );

        const foodData = response.data.map((item) => item.category.food);
        const travelData = response.data.map((item) => item.category.travel);
        const shoppingData = response.data.map(
          (item) => item.category.shopping
        );
        const personalData = response.data.map(
          (item) => item.category.personal
        );
        const otherData = response.data.map((item) => item.category.other);

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Food",
              data: foodData,
              backgroundColor: "rgba(255, 99, 132)",
              borderColor: "rgba(255, 99, 132, 1)",
            },
            {
              label: "Travel",
              data: travelData,
              backgroundColor: "rgba(54, 162, 235)",
              borderColor: "rgba(54, 162, 235, 1)",
            },
            {
              label: "Shopping",
              data: shoppingData,
              backgroundColor: "rgba(255, 206, 86)",
              borderColor: "rgba(255, 206, 86, 1)",
            },
            {
              label: "Personal",
              data: personalData,
              backgroundColor: "rgba(75, 192, 192)",
              borderColor: "rgba(75, 192, 192, 0.4)",
            },
            {
              label: "Others",
              data: otherData,
              backgroundColor: "rgba(153, 102, 255)",
              borderColor: "rgba(153, 102, 255, 0.4)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="text-white">{error}</div>;
  }

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ₹${tooltipItem.raw}`;
          },
        },
      },

      legend: {
        position: "bottom",
        labels: {
          color: "white",
          font: { size: 12 },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "",
        font: { size: 15, weight: "bold" },
        color: "#CBACF9",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: { color: "white" },
        grid: { color: "#3B3F52" },
      },
      y: {
        stacked: true,
        ticks: { color: "white" },
      },
    },
  };

  return (
    <div className="h-full flex flex-col justify-center items-center bg-[#04071D]  bg-opacity-60 border-2 border-[#161A31] p-9  rounded-[30px] shadow-lg">
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
          <h1 className="text-2xl text-white font-regular text-center mb-10 align-top">
            Spending Over Time
          </h1>
          <div className="w-[90%]">
            <Bar data={chartData} options={options} />
          </div>
        </>
      )}
    </div>
  );
};

export default StackedBarChart;
