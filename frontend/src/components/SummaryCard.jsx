// src/components/SummaryCard.js
import { Check, PenIcon } from "lucide-react";
import React, { useState } from "react";
import axios from "../axios";
const SummaryCard = ({ title, value, icon }) => {
  const [Expense, setExpense] = useState(false);
  const [expenseValue, setExpenseValue] = useState(value);
  const changeBudget = async () => {
    setExpense(false);
    try {
      const response = await axios
        .post(
          "/changebudget",
          {
            budget: expenseValue,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => res.data);
      if (response.message === "ok") {
        alert("Budget updated successfully");
      }
    } catch (err) {
      console.error("Budget error:", err);
    }
  };
  return (
    <div
      className={`min-w-fit flex bg-[#04071D] text-white items-center p-5 rounded-[30px] shadow gap-5 border-[#363749] border-t-[#CBACF9] border-opacity-40  border-2 border-t-[6px]`}
    >
      <img src={icon} alt={title} />
      <div>
        <h4 className="font-semibold text-[1rem] ">{title}</h4>
        {title == "Total Budget" ? (
          !Expense ? (
            <div className="flex items-center gap-2">
              <p
                className="text-[1.5rem] 
            text-green-400
            font-regular"
              >
                {value}
              </p>
              <PenIcon
                className="cursor-pointer"
                onClick={() => setExpense(true)}
                size={20}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={expenseValue}
                className="bg-[#161A31] text-white h-10 w-20 p-2 rounded-md "
                onChange={(e) => setExpenseValue(e.target.value)}
              />
              <Check
                onClick={() => changeBudget()}
                size={20}
                className="cursor-pointer"
              />
            </div>
          )
        ) : (
          <p
            className="text-[1.5rem] 
            text-green-400
          font-regular"
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
