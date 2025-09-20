import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FavoriteClassesChart = ({ favoriteClasses }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Favorite Classes by Rating',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const data = {
    labels: favoriteClasses.map(cls => 
      cls.title.length > 20 ? cls.title.substring(0, 20) + '...' : cls.title
    ),
    datasets: [
      {
        label: 'Average Rating',
        data: favoriteClasses.map(cls => cls.average_rating),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Ratings',
        data: favoriteClasses.map(cls => cls.total_ratings),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
    ],
  };

  const optionsWithSecondAxis = {
    ...options,
    scales: {
      ...options.scales,
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-80">
        <Bar options={optionsWithSecondAxis} data={data} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Showing top {favoriteClasses.length} classes by rating and review count</p>
      </div>
    </div>
  );
};

export default FavoriteClassesChart;