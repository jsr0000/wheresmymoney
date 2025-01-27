"use client";

import React, { useState, useRef, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, Title, DoughnutController, CategoryScale,
  LinearScale, BarElement
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the datalabels plugin
import AuthButton from "./components/AuthButton";
import { useSession } from "next-auth/react";

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
  const [totalAmount, setTotalAmount] = useState(0);
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
        suggestedMax: 10000,
        title: {
          display: true,
          text: '💷 Quantity (£)',
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
            return value.toLocaleString();  // Format numbers with commas
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

  const { data: session } = useSession();
  const [userAssets, setUserAssets] = useState([]);

  useEffect(() => {
    const loadUserAssets = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/assets');
          if (!response.ok) throw new Error('Failed to fetch assets');
          const assets = await response.json();

          // Process assets for charts
          if (assets.length > 0) {
            const latestAssets = assets.reduce((acc, asset) => {
              if (!acc[asset.name] || new Date(acc[asset.name].timestamp) < new Date(asset.timestamp)) {
                acc[asset.name] = asset;
              }
              return acc;
            }, {});

            const chartData = {
              labels: Object.values(latestAssets).map(asset => asset.name),
              datasets: [{
                data: Object.values(latestAssets).map(asset => asset.quantity),
                backgroundColor: greenColors,
                borderColor: "#fff",
                borderWidth: 2,
              }]
            };

            setChartData(chartData);
            setTotalAmount(Object.values(latestAssets).reduce((sum, asset) => sum + asset.quantity, 0));

            // Set historical data for bar chart
            const historicalData = assets.reduce((acc, asset) => {
              const date = new Date(asset.timestamp).toLocaleDateString();
              if (!acc[date]) acc[date] = [];
              acc[date].push(asset);
              return acc;
            }, {});

            setBarChartData({
              labels: Object.keys(historicalData),
              datasets: Object.values(historicalData).map((assets, index) => ({
                label: assets[0].name,
                data: assets.map(a => a.quantity),
                backgroundColor: greenColors[index % greenColors.length],
              }))
            });
          }
        } catch (error) {
          console.error('Error loading assets:', error);
        }
      }
    };

    loadUserAssets();
  }, [session?.user?.id, greenColors]);

  const generateChartData = async () => {
    const labels = inputs.map((input) => input.asset);
    const data = inputs.map((input) => parseFloat(input.quantity) || 0);

    // Calculate and update total before resetting inputs
    const newTotal = data.reduce((sum, value) => sum + value, 0);
    setTotalAmount(newTotal);

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

    // Reset inputs without losing the total
    setInputs([{ asset: "", quantity: "" }]);

    handleScrollToChart();

    if (session) {
      try {
        await fetch('/api/assets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assets: inputs.map(input => ({
              asset: input.asset,
              quantity: parseFloat(input.quantity) || 0
            }))
          }),
        });
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] text-white">
      <AuthButton />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <h1 className="text-7xl font-bold">
              <span className="text-green-500">Track your wealth</span>
              <br />
              <span className="text-gray-200">with ease</span>
            </h1>
            <p className="text-gray-400 text-xl">
              Visualize your assets, savings and investments in one place.
            </p>
          </div>

          {/* Right Column - Input Form */}
          <div className="bg-[#232323] p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-shadow duration-300">
            <div className="space-y-4">
              {inputs.map((input, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Asset Name"
                    value={input.asset}
                    onChange={(e) => updateInput(index, "asset", e.target.value)}
                    className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500"
                  />
                  <input
                    type="number"
                    placeholder="Amount (£)"
                    value={input.quantity}
                    onChange={(e) => updateInput(index, "quantity", e.target.value)}
                    className="w-1/3 bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500"
                  />
                </div>
              ))}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={addRow}
                  className="flex-1 bg-[#2a2a2a] text-green-500 border-2 border-green-500 px-6 py-3 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 shadow-[0_4px_15px_rgb(0,0,0,0.2)] hover:shadow-[0_4px_15px_rgb(0,0,0,0.3)]"
                >
                  Add Asset
                </button>
                <button
                  onClick={generateChartData}
                  className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-[0_4px_15px_rgb(0,0,0,0.2)] hover:shadow-[0_4px_15px_rgb(0,0,0,0.3)]"
                >
                  Generate Charts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {/* {chartsGenerated && ( */}
      <div className="bg-[#232323] py-16" ref={scrollToChartRef}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Total Assets: <span className="text-green-500">£{totalAmount.toFixed(2)}</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pie Chart - Takes up 1/3 of the space */}
            <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-shadow duration-300">
              <h3 className="text-3xl font-semibold mb-6 text-center text-gray-200">Asset Distribution</h3>
              <div className="w-full max-w-[300px] mx-auto">
                <Pie data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Bar Chart - Takes up 2/3 of the space */}
            <div className="lg:col-span-2 bg-[#2a2a2a] p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-shadow duration-300">
              <h3 className="text-3xl font-semibold mb-6 text-center text-gray-200">Asset History 📈</h3>
              <div className="w-full h-[400px]">
                <Bar data={barChartData} options={{
                  ...barChartOptions,
                  maintainAspectRatio: false
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}


