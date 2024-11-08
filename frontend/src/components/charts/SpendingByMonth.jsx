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
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "../../axios";
// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const SpendingByMonth = () => {
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/monthlyspendingtrend", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLoading(false);
        const { labels, data } = response.data;
        setChartData({ labels, data });
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        display: true,
        labels: {
          color: "#fff",
          font: {
            family: "Poppins",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#1e1e1e",
        titleColor: "#fff",
        bodyColor: "#ddd",
        borderWidth: 1,
        borderColor: "#444",
        callbacks: {
          label: function (data) {
            return "Total: ₹" + new Intl.NumberFormat("tr-TR").format(data.raw);
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff",
          font: {
            family: "Poppins",
            size: 12,
          },
        },
        grid: {
          display: true,
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#fff",
          font: {
            family: "Poppins",
            size: 12,
          },
        },
        grid: {
          display: true,
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Monthly Expenses",
        data: chartData.data, // [200, 300, ...]
        borderColor: "rgba(153, 102, 255, 0.5)",

        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderWidth: 2,
        tension: 0.4, // Smooth curve
        pointRadius: 5, // Size of points
        pointBackgroundColor: "#fff", // Color of points
        pointBorderColor: "rgba(153,102,255)",
      },
    ],
  };

  return (
    <div className="h-[520px]  flex flex-col justify-center items-center bg-[#04071D] border-2 border-[#161A31] p-9 pt-6 rounded-[30px] shadow-lg">
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
          <h1 className="text-2xl text-white font-regular text-center mb-4 align-top">
            Spending By Month
          </h1>
          <div className="w-full h-full">
            <Line data={data} options={options} />
          </div>
        </>
      )}
    </div>
  );
};
export default SpendingByMonth;
