import React, { useEffect, useState } from "react";
import BudgetIcon from "../assets/budget.svg";
import axios from "../axios.js";
import AddExpense from "../components/AddExpense";
import SummaryCard from "../components/SummaryCard";
import MonthExpense from "../components/charts/MonthExpense";

const Dashboard = () => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [expenseChartData, setExpenseChartData] = useState([
    { ExpenseType: "Food and Groceries", totalExpense: 0 },
    { ExpenseType: "Travel", totalExpense: 0 },
    { ExpenseType: "Personal", totalExpense: 0 },
    { ExpenseType: "Shopping", totalExpense: 0 },
    { ExpenseType: "Others", totalExpense: 0 },
  ]);

  const fetchExpenses = async () => {
    try {
      const response = await axios
        .get("/spending", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => res.data);

      const expenses = response.reduce((acc, expense) => {
        return (
          acc +
          Number(expense.food) +
          Number(expense.travel) +
          Number(expense.shopping) +
          Number(expense.personal) +
          Number(expense.other)
        );
      }, 0);

      setExpenseChartData((prevData) => {
        const updatedData = [...prevData];
        updatedData[0].totalExpense = response.reduce((acc, expense) => {
          return acc + Number(expense.food);
        }, 0);
        updatedData[1].totalExpense = response.reduce((acc, expense) => {
          return acc + Number(expense.travel);
        }, 0);
        updatedData[2].totalExpense = response.reduce((acc, expense) => {
          return acc + Number(expense.shopping);
        }, 0);
        updatedData[3].totalExpense = response.reduce((acc, expense) => {
          return acc + Number(expense.personal);
        }, 0);
        updatedData[4].totalExpense = response.reduce((acc, expense) => {
          return acc + Number(expense.other);
        }, 0);
        return updatedData;
      });

      setTotalExpenses(expenses);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await axios
        .get("/budget", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => res.data);
      setTotalBudget(parseInt(response[0].budget));
    } catch (err) {
      console.error("Error fetching budget:", err);
    }
  };

  useEffect(() => {
    fetchBudget();
    fetchExpenses();
  }, []);

  useEffect(() => {
    setRemainingBudget(totalBudget - totalExpenses);
  }, [totalBudget, totalExpenses]);

  return (
    <>
      <div className="flex flex-col items-center justify-start min-h-screen bg-none">
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-1 gap-10 p-6 mt-7">
          <SummaryCard
            title="Total Budget"
            value={totalBudget}
            icon={BudgetIcon}
          />
          <SummaryCard
            title="Total Expenses"
            value={totalExpenses}
            icon={BudgetIcon}
          />
          <SummaryCard
            title="Remaining Budget"
            value={remainingBudget}
            icon={BudgetIcon}
          />
        </div>

        {/* Add other dashboard components like charts and tables here */}
        <div className="flex w-full justify-around items-end mt-8">
          <MonthExpense ChartData={expenseChartData} />
          <AddExpense onExpenseAdded={fetchExpenses} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
