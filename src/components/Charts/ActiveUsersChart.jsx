import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ActiveUsersChart = ({ activeUsers }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Active Users by Karma Points',
      },
    },
  };

  // Generate colors for each user
  const colors = [
    'rgba(239, 68, 68, 0.8)',   // red
    'rgba(59, 130, 246, 0.8)',  // blue
    'rgba(16, 185, 129, 0.8)',  // green
    'rgba(245, 158, 11, 0.8)',  // yellow
    'rgba(139, 92, 246, 0.8)',  // purple
    'rgba(236, 72, 153, 0.8)',  // pink
    'rgba(14, 165, 233, 0.8)',  // sky
    'rgba(34, 197, 94, 0.8)',   // emerald
  ];

  const data = {
    labels: activeUsers.map(user => user.name),
    datasets: [
      {
        label: 'Karma Points',
        data: activeUsers.map(user => user.karma_points),
        backgroundColor: colors.slice(0, activeUsers.length),
        borderColor: colors.slice(0, activeUsers.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-80">
        <Doughnut options={options} data={data} />
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {activeUsers.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index] }}
                ></div>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{user.karma_points}</div>
                <div className="text-gray-500 text-xs">{user.classes_attended} classes</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersChart;