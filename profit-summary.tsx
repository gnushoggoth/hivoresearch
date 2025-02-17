import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';

interface ProfitData {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

const ProfitSummary: React.FC = () => {
  // Initialize state variables to hold the parsed CSV data 
  // and the calculated summary statistics
  const [data, setData] = useState<ProfitData[]>([]); 
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [averageMargin, setAverageMargin] = useState(0);

  useEffect(() => {
    // Fetch and parse the CSV data when the component mounts
    const fetchData = async () => {
      const response = await fetch('monthly_profits.csv');
      const csvText = await response.text();

      // Use Papa Parse to convert the CSV into an array of objects
      const parsedData = Papa.parse<ProfitData>(csvText, {
        header: true, // Use first row as headers
        dynamicTyping: true, // Convert values to native types
        skipEmptyLines: true // Ignore empty lines
      }).data;
      
      setData(parsedData);

      // Calculate the total revenue, total profit, and average profit margin
      const totalRevenue = _.sumBy(parsedData, 'revenue');
      setTotalRevenue(totalRevenue);

      const totalProfit = _.sumBy(parsedData, 'profit');  
      setTotalProfit(totalProfit);

      const avgMarginPct = totalProfit / totalRevenue * 100;
      setAverageMargin(_.round(avgMarginPct, 2)); // Round to 2 decimal places
    };
    
    fetchData();
  }, []); // Empty dependency array, so this only runs once on mount

  return (
    <div className="p-4 rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Monthly Profit Summary</h2>
      <div className="mb-4">
        <div className="text-gray-500">Total Revenue</div>
        <div className="text-3xl">${totalRevenue.toLocaleString()}</div>
      </div>
      <div className="mb-4">
        <div className="text-gray-500">Total Profit</div>
        <div className="text-3xl">${totalProfit.toLocaleString()}</div>
      </div>
      <div>
        <div className="text-gray-500">Average Profit Margin</div>
        <div className="text-3xl">{averageMargin}%</div>
      </div>
    </div>
  );
};

export default ProfitSummary;
