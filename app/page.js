"use client";

import React, { useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const scrollToSectionRef = useRef(null);

  const handleScroll = () => {
    scrollToSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // State for inputs and chart data
  const [inputs, setInputs] = useState([{ asset: "", quantity: 0 }]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  });

  // Add a new input row
  const addRow = () => {
    setInputs([...inputs, { asset: "", quantity: 0 }]);
  };

  // Update input values
  const updateInput = (index, field, value) => {
    const updatedInputs = inputs.map((input, i) =>
      i === index ? { ...input, [field]: value } : input
    );
    setInputs(updatedInputs);
  };

  // Generate chart data
  const generateChartData = () => {
    const labels = inputs.map((input) => input.asset);
    const data = inputs.map((input) => parseFloat(input.quantity) || 0);

    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        },
      ],
    });
  };

  return (
    <div>
      <div>
        <h1 className="flex justify-center pt-40">Asset Tracker</h1>
      </div>
      <div className="flex items-center justify-center p-40">
        <button
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          onClick={handleScroll}
        >
          Start Tracking!
        </button>
      </div>
      <div className="pt-40" ref={scrollToSectionRef}>
        {inputs.map((input, index) => (
          <div key={index} className="flex items-center justify-center gap-10 py-3">
            <input
              type="text"
              placeholder="Asset"
              value={input.asset}
              onChange={(e) => updateInput(index, "asset", e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500 text-background"
            />
            <input
              type="number"
              placeholder="Quantity (£)"
              value={input.quantity}
              onChange={(e) => updateInput(index, "quantity", e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-green-500 text-background"
            />
          </div>
        ))}
        <div className="flex items-center justify-center py-3">
          <button
            onClick={addRow}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Row
          </button>
          <button
            onClick={generateChartData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4"
          >
            Generate Chart
          </button>
        </div>
      </div>
      <div  className="pt-20">
        <h2 className="text-center text-xl font-bold mb-4">Pie Chart</h2>
        <div className="flex justify-center">
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  );
}
