import React, { useEffect, useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { alertsData } from '../Data/Data';
import Chart from 'chart.js/auto'; // Import Chart from 'chart.js/auto'
import { BarController } from 'chart.js'; // Import BarController from 'chart.js'

const Dashboard = () => {
  const categoryChartRef = useRef(null);
  const topSrcIpChartRef = useRef(null);
  const alertsOverTimeChartRef = useRef(null);

  useEffect(() => {
    // Register bar controller
    Chart.register(BarController);

    return () => {
      // Destroy charts when component unmounts
      if (categoryChartRef.current) {
        categoryChartRef.current.destroy();
      }
      if (topSrcIpChartRef.current) {
        topSrcIpChartRef.current.destroy();
      }
      if (alertsOverTimeChartRef.current) {
        alertsOverTimeChartRef.current.destroy();
      }
    };
  }, []);

  // Data preparation with safety checks
  const categories = alertsData.map(alert => alert.alert?.category || 'Unknown');
  const uniqueCategories = [...new Set(categories)];

  const categoryCounts = uniqueCategories.map(category => 
    categories.filter(cat => cat === category).length
  );

  const topSrcIps = alertsData.reduce((acc, alert) => {
    acc[alert.src_ip] = (acc[alert.src_ip] || 0) + 1;
    return acc;
  }, {});

  const topSrcIpData = Object.entries(topSrcIps).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const timestamps = alertsData.map(alert => new Date(alert.timestamp).toLocaleString());

  // Chart data
  const categoryData = {
    labels: uniqueCategories,
    datasets: [{
      label: 'Number of Alerts',
      data: categoryCounts,
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };

  const topSrcIpChartData = {
    labels: topSrcIpData.map(item => item[0]),
    datasets: [{
      label: 'Number of Alerts',
      data: topSrcIpData.map(item => item[1]),
      backgroundColor: 'rgba(153, 102, 255, 0.6)'
    }]
  };

  const alertsOverTimeData = {
    labels: timestamps,
    datasets: [{
      label: 'Number of Alerts',
      data: timestamps.map(() => 1),
      backgroundColor: 'rgba(255, 159, 64, 0.6)'
    }]
  };

  return (
    <div>
        <h2 className='text-center text-3xl md:text-9xl font-serif font-extrabold underline'>Dashboard</h2>
      <div className='flex md:flex-row flex-col justify-center items-center mt-10 md:mt-28 md:gap-3  '>
      <div className="chart-container w-[95%] md:w-[30%] border border-white md:p-8 p-3 rounded-md">
        <h3 className='mb-7'>Number of Alerts per Category</h3>
        <Bar data={categoryData} />
      </div>
      <div className="chart-container w-[95%] md:w-[30%] border border-white md:p-8 p-3 rounded-md">
        <h3 className='mb-7'>Top Source IPs</h3>
        <Bar data={topSrcIpChartData} />
      </div>
      <div className="chart-container w-[95%] md:w-[30%] border border-white md:p-8 p-3 rounded-md">
        <h3 className='mb-7'>Alerts Over Time</h3>
        <Line data={alertsOverTimeData} />
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
