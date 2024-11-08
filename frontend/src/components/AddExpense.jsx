import React, { useState } from "react";
import axios from "../axios";

const AddExpense = ({ onExpenseAdded }) => {
  const [Expense, setExpense] = useState({
    food: "",
    travel: "",
    shopping: "",
    personal: "",
    other: "",
  });
  const [adding, setAdding] = useState(false);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await axios
        .post(
          "/spending",
          {
            food: Expense.food,
            travel: Expense.travel,
            shopping: Expense.shopping,
            personal: Expense.personal,
            other: Expense.other,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => res.data);
      if (response.message === "Spending recorded successfully") {
        setExpense({
          food: "",
          travel: "",
          shopping: "",
          personal: "",
          other: "",
        });
        setAdding(false);
        alert("Expense added successfully");
        onExpenseAdded(); // Call the callback to refresh expenses
      }
    } catch (err) {
      console.error("Expense error:", err);
      setAdding(false);
    }
  };

  return (
    <div className="bg-[#04071D] text-gray-600 shadow-lg rounded-[30px] pt-5 p-8 max-w-md w-full border-2 border-[#161A31]">
      <h1 className="text-[1.2rem] font-bold text-center text-[#CBACF9] mb-2">
        Add Today's Expenses
      </h1>
      <p className="text-xs text-gray-400 mb-4">
        Add your daily expenses here. You can add multiple expenses at once.
        Leave the field empty if you don't have any expense in that category.💜
      </p>
      <form className="space-y-3" onSubmit={handleExpenseSubmit}>
        <input
          type="text"
          placeholder="Food and Groceries"
          name="food"
          value={Expense.food}
          onChange={(e) => setExpense({ ...Expense, food: e.target.value })}
          className="w-full bg-transparent px-4 py-2 rounded-lg text-white focus:outline-none border-[#161A31] border-2"
        />
        <input
          type="text"
          placeholder="Travel"
          name="travel"
          value={Expense.travel}
          onChange={(e) => setExpense({ ...Expense, travel: e.target.value })}
          className="w-full bg-transparent px-4 py-2 rounded-lg text-white focus:outline-none border-[#161A31] border-2"
        />
        <input
          type="text"
          placeholder="Shopping"
          name="shopping"
          value={Expense.shopping}
          onChange={(e) => setExpense({ ...Expense, shopping: e.target.value })}
          className="w-full bg-transparent px-4 py-2 rounded-lg text-white focus:outline-none border-[#161A31] border-2"
        />
        <input
          type="text"
          placeholder="Personal"
          name="personal"
          value={Expense.personal}
          onChange={(e) => setExpense({ ...Expense, personal: e.target.value })}
          className="w-full bg-transparent px-4 py-2 rounded-lg text-white focus:outline-none border-[#161A31] border-2"
        />
        <input
          type="text"
          placeholder="Others"
          name="other"
          value={Expense.other}
          onChange={(e) => setExpense({ ...Expense, other: e.target.value })}
          className="w-full bg-transparent px-4 py-2 rounded-lg text-white focus:outline-none border-[#161A31] border-2"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#c3a2f4] to-[#8A3FFC] text-white px-4 py-2 rounded-lg hover:from-[#8A3FFC] hover:to-[#c3a2f4] transition duration-200 ease-in-out"
        >
          {adding ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
