import React from 'react';

// Define the data for the stats
const statsData = [
  { icon: '✈️', label: 'Flights Operated', value: '15,000+' },
  { icon: '⏱️', label: 'On-Time Performance', value: '92%' },
  { icon: '🌍', label: 'Destinations Served', value: '75' },
  { icon: '😊', label: 'Customer Satisfaction', value: '4.8/5' },
  { icon: '👥', label: 'Passengers Carried (Last Year)', value: '2M+' },
  { icon: '🛫', label: 'Fleet Size', value: '40' },
  { icon: '🗺️', label: 'New Routes (This Quarter)', value: '5' },
  { icon: '📈', label: 'Growth YoY', value: '18%' },
];

// Define the React component
const AirlineStats = () => {
  return (
    <div className="container mx-auto p-8 mt-20 bg-zinc-900 shadow-lg text-white font-sans w-full m-5"> 
      <div className="grid grid-cols-1 md:grid-cols-4 gap-20 text-center">
        {statsData.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-lg text-gray-400">{stat.label}</div>
            <div className="text-7xl font-light mt-1">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the component for use in Next.js pages
export default AirlineStats;
