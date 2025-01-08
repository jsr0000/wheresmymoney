"use client";
import React, { useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, DoughnutController } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the datalabels plugin

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title, DoughnutController, ChartDataLabels);

export default function Home() {
  const scrollToChartRef = useRef(null);

  const handleScrollToChart = () => {
    scrollToChartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // State for inputs and chart data
  const [inputs, setInputs] = useState([{ asset: "", quantity: "" }]);
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
        position: "right",
        padding: 10,
        labels: {
          color: "#fff",
          font: {
            size: 14,
            family: "Gantari",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)", // Dark background
        titleColor: "#fff", // White title
        bodyColor: "#fff", // White body text
        borderColor: "#fff", // White border
        borderWidth: 1,
        bodyFont: {
          size: 14,
          family: "Arial, sans-serif",
        },
        padding: 12, // Add some padding
        callbacks: {
          label: function (tooltipItem) {
            // Custom label formatting (remove color box)
            const value = tooltipItem.raw || 0;
            return `£${value.toFixed(2)}`;
          },
          title: function (tooltipItems) {
            // Access the first tooltip item and get its label
            const label = tooltipItems[0]?.label || "Unknown";
            return label;
          },
        },
        displayColors: false,
      },
      datalabels: {
        display: true,
        color: "#fff",
        formatter: (value, context) => {
          const total = context.chart._metasets[context.datasetIndex].total;
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`; // Show percentage on each slice
        },
        font: {
          size: 14,
          weight: "bold",
        },
      },
    },
  });

  const addRow = () => {
    setInputs([...inputs, { asset: "", quantity: "" }]);
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
          backgroundColor: ["#2fe514", "#00813e", "#317a11", "#076438", "#a8f983"],
          hoverBackgroundColor: ["#dedede"],
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
          <h1 className="text-8xl font-bold px-10">Where's Your Money?</h1>
          <p className="text-gray-500 mt-2 px-10 py-5 text-2xl font-italic">Visualize your savings and investments.</p>
        </div>

        {/* Right Section: Input Boxes */}
        <div className="space-y-4 p-10">
          {inputs.map((input, index) => (
            <div key={index} className="flex gap-10">
              <input
                type="text"
                placeholder="Asset"
                value={input.asset}
                onChange={(e) => updateInput(index, "asset", e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-2/3 focus:outline-none focus:ring-2 focus:ring-green-500 text-background"
              />
              <input
                type="number"
                placeholder="Quantity (£)"
                value={input.quantity}
                onChange={(e) => updateInput(index, "quantity", e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500 text-background"
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
      <div className="pt-20 flex items-center justify-center" ref={scrollToChartRef}>
        <div className="flex" style={{ width: "50%" }}>
          <Pie data={chartData} options={chartOptions} />
        </div>
        <h3 className="text-center text-lg font-semibold mb-4 pl-10">
          Total Quantity: £{totalQuantity.toFixed(2)}
        </h3>
      </div>
    </div>
  );
}
