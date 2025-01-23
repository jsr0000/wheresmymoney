"use client";

import React, { useState, useRef } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, Title, DoughnutController, CategoryScale,
  LinearScale, BarElement
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the datalabels plugin
import AuthButton from "./components/AuthButton";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  DoughnutController,
  ChartDataLabels,
  CategoryScale,    // Register new components
  LinearScale,
  BarElement
);

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

  // Define a consistent color palette at the top level
  const greenColors = ["#2fe514", "#00813e", "#317a11", "#076438", "#a8f983"];

  // Create a consistent tooltip callback
  const tooltipCallback = {
    label: function (context) {
      const value = context.raw || context.parsed.y || 0;
      return `£${value.toLocaleString()} 💰`;
    },
    title: function (tooltipItems) {
      const label = tooltipItems[0]?.dataset?.label || tooltipItems[0]?.label || "Unknown";
      return label;
    }
  };

  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        display: false,
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

  // Add new state for historical data
  const [historicalData, setHistoricalData] = useState([]);

  // Add state for bar chart
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: []
  });

  // Update bar chart options to enable stacking
  const [barChartOptions, setBarChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        display: false,  // Remove the color key/legend
      },
      title: {
        display: true,
        text: 'Asset History 📈',
        color: "#fff",
        font: {
          size: 24,
          family: "Gantari",
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#2fe514",
        borderWidth: 1,
        bodyFont: {
          size: 14,
          family: "Gantari",
        },
        padding: 12,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y || 0;
            return `£${value.toLocaleString()} 💰`;
          },
          title: function (tooltipItems) {
            const label = tooltipItems[0]?.dataset.label || "Unknown";
            return label;
          },
        },
        displayColors: false,
      },
      datalabels: {
        display: true,
        color: '#fff',
        anchor: 'center',
        align: 'center',
        formatter: function (value, context) {
          if (value > 0) {
            return context.dataset.label;  // Show asset name instead of value
          }
          return '';  // Don't show label if value is 0
        },
        font: {
          weight: 'bold',
          size: 13,
          family: "Gantari",
        },
        textShadow: '0 0 3px rgba(0,0,0,0.5)'  // Add text shadow for better readability
      }
    },
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: '💷 Amount in Pounds',
          color: "#fff",
          font: {
            size: 16,
            family: "Gantari",
            weight: 'bold'
          },
          padding: { top: 20, bottom: 10 }
        },
        ticks: {
          color: "#fff",
          font: {
            size: 14,
            family: "Gantari"
          },
          callback: function (value) {
            return '£' + value.toLocaleString();  // Format numbers with commas
          },
          padding: 10
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false,
        }
      },
      x: {
        stacked: true,
        title: {
          display: true,
          text: '📅 Date',
          color: "#fff",
          font: {
            size: 16,
            family: "Gantari",
            weight: 'bold'
          },
          padding: { top: 10, bottom: 0 }
        },
        ticks: {
          color: "#fff",
          font: {
            size: 14,
            family: "Gantari"
          },
          padding: 10
        },
        grid: {
          display: false  // Remove vertical grid lines
        }
      }
    },
    animation: {
      duration: 1500,  // Longer animation
      easing: 'easeInOutQuart'  // Smoother animation
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    }
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

    // Update pie chart data
    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: greenColors,
          hoverBackgroundColor: ["#dedede"],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    });

    // Add new data point to historical data
    const timestamp = new Date().toLocaleDateString();
    const newDataPoint = {
      timestamp,
      assets: inputs.map(input => ({
        asset: input.asset,
        quantity: parseFloat(input.quantity) || 0
      }))
    };

    const updatedHistoricalData = [...historicalData, newDataPoint];
    setHistoricalData(updatedHistoricalData);

    // Create stacked bar chart data
    const vibrantColors = [
      "#00ff87",  // Bright mint
      "#00b894",  // Sea green
      "#55efc4",  // Light teal
      "#00cec9",  // Turquoise
      "#81ecec",  // Light cyan
      "#74b9ff",  // Sky blue
      "#32ff7e",  // Lime
      "#7bed9f"   // Light green
    ];

    const assets = [...new Set(updatedHistoricalData.flatMap(data =>
      data.assets.map(asset => asset.asset)
    ))].filter(asset => asset); // Filter out empty asset names

    const datasets = assets.map((assetName, index) => ({
      label: assetName,
      data: updatedHistoricalData.map(dataPoint => {
        const asset = dataPoint.assets.find(a => a.asset === assetName);
        return asset ? asset.quantity : 0;
      }),
      backgroundColor: greenColors[index % greenColors.length],
    }));

    setBarChartData({
      labels: updatedHistoricalData.map(data => data.timestamp),
      datasets
    });

    setInputs([{ asset: "", quantity: "" }]);


    handleScrollToChart();
  };

  const totalQuantity = inputs.reduce((total, input) => total + (parseFloat(input.quantity) || 0), 0);

  return (
    <div>
      <AuthButton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center h-screen px-10">
        {/* Left Section: Header */}
        <div className="text-left">
          <h1 className="text-8xl font-bold px-10">Where's Your Money?</h1>
          <p className="text-gray-500 mt-2 px-10 py-5 text-2xl font-italic">Visualize your assets, savings and investments.</p>
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

      {/* Update Chart Section layout */}
      <div className="pt-20 flex flex-col items-center justify-center" ref={scrollToChartRef}>
        <h3 className="text-center text-6xl font-semibold mb-20">
          Total: £{totalQuantity.toFixed(2)}
        </h3>
        <div className="w-1/3 mb-40">
          <Pie data={chartData} options={chartOptions} />
        </div>
        <div className="w-full px-10 mb-10">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
}


