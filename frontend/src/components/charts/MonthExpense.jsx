import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthExpense({
  ChartData = [
    { ExpenseType: "Food and Groceries", totalExpense: 0 },
    { ExpenseType: "Travel", totalExpense: 0 },
    { ExpenseType: "Personal", totalExpense: 0 },
    { ExpenseType: "Shopping", totalExpense: 0 },
    { ExpenseType: "Others", totalExpense: 0 },
  ],
}) {
  const canvasRef = React.useRef(null);
  const currentDate = new Date();

  // Get the current month number (0-11)
  const monthNumber = currentDate.getMonth() + 1; // Adding 1 to get a 1-12 range

  // If you want the full name of the month
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the full name of the month
  const monthName = monthNames[currentDate.getMonth()];
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${monthName} Month Expenses`,
        color: "#fff",
        font: {
          family: "Poppins",
          size: 20,
          weight: "normal",
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
          color: "rgba(255, 255, 255  , 0.1)",
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
    labels: ChartData.map((item) => item.ExpenseType),
    datasets: [
      {
        label: "Monthly Expenses",
        data: ChartData.map((item) => item.totalExpense),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],

        borderWidth: 1,
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderRadius: 5,
        barThickness: 50,
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(255, 205, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(201, 203, 207, 0.5)",
        ],
        hoverBorderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        hoverBorderWidth: 2,
      },
    ],
  };

  return (
    <div
      className="h-full w-1/2 flex justify-center items-center bg-[#04071D]
        border-2 border-[#161A31]
     p-6 rounded-[30px] shadow-lg"
    >
      <div className="w-full h-[420px]">
        <Bar ref={canvasRef} data={data} options={options} />
      </div>
    </div>
  );
}
