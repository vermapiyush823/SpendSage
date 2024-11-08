import React from "react";
import SpendingByCategory from "../components/charts/SpendingByCategory";
import SpendingByMonth from "../components/charts/SpendingByMonth";
import SpendingOverTime from "../components/charts/SpendingOverTime";
const Analysis = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-4xl text-[#CBACF9] font-semibold text-center mt-10 mb-5">
        Analysis
      </h1>
      <div className="w-full grid grid-cols-2 p-8 gap-5">
        <SpendingByCategory />
        <SpendingByMonth />
      </div>
      <div className="w-full p-8">
        <SpendingOverTime />
      </div>
    </div>
  );
};

export default Analysis;
