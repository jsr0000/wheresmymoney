"use client";

import React, { useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const scrollToChartRef = useRef(null);

  const handleScrollToChart = () => {
    scrollToChartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // State for inputs and chart data
  const [inputs, setInputs] = useState([{ asset: "", quantity: 0 }]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  });

  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#333",
          font: {
            size: 14,
            family: "Arial, sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        bodyFont: {
          size: 12,
        },
        padding: 10,
      },
    },
  });

  const addRow = () => {
    setInputs([...inputs, { asset: "", quantity: 0 }]);
  };

  const updateInput = (index, field, value) => {
    const updatedInputs = inputs.map((input, i) =>
      i === index ? { ...input, [field]: value } : input
    );
    setInputs(updatedInputs);
  };

  const generateChartData = () => {
    const labels = inputs.map((input) => input.asset);
    const data = inputs.map((input) => parseFloat(input.quantity) || 0);

    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    });

    handleScrollToChart();
  };

  const totalQuantity = inputs.reduce((total, input) => total + (parseFloat(input.quantity) || 0), 0);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center h-screen px-10">
        {/* Left Section: Header */}
        <div className="text-left">
          <h1 className="text-4xl font-bold">Where's Your Money?</h1>
          <p className="text-gray-600 mt-2">Track your assets and visualize your spending.</p>
        </div>

        {/* Right Section: Input Boxes */}
        <div className="space-y-4">
          {inputs.map((input, index) => (
            <div key={index} className="flex gap-4">
              <input
                type="text"
                placeholder="Asset"
                value={input.asset}
                onChange={(e) => updateInput(index, "asset", e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-2/3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Quantity (£)"
                value={input.quantity}
                onChange={(e) => updateInput(index, "quantity", e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
          <div className="flex gap-4">
            <button
              onClick={addRow}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Row
            </button>
            <button
              onClick={generateChartData}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Generate Chart
            </button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="pt-20" ref={scrollToChartRef}>
        <h3 className="text-center text-lg font-semibold mb-4">
          Total Quantity: £{totalQuantity.toFixed(2)}
        </h3>
        <div className="flex justify-center">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

