import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const UserStreakChart = ({ activeUsers }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Activity Streaks',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const data = {
    labels: activeUsers.map(user => user.name),
    datasets: [
      {
        label: 'Current Streak',
        data: activeUsers.map(user => user.current_streak),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: 'Longest Streak',
        data: activeUsers.map(user => user.longest_streak),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-80">
        <Line options={options} data={data} />
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {activeUsers.map((user) => (
          <div key={user.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-gray-600 text-xs">{user.title}</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Current:</span>
                <span className="font-medium text-blue-600">{user.current_streak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Best:</span>
                <span className="font-medium text-green-600">{user.longest_streak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rating:</span>
                <span className="font-medium text-yellow-600">⭐ {user.average_rating_given}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStreakChart;