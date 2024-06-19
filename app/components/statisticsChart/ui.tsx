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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Student, StatisticsData, ChartData } from './interface';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const countPosts = (student: Student, period: string): number => {
  // Здесь нужно реализовать логику подсчета постов для каждого студента за указанный период
  // Для демонстрации возвращаем случайное число
  return Math.floor(Math.random() * 100);
};

const StatisticsChart: React.FC<StatisticsData> = ({ students, period }) => {
  // Данные для графика
  const data: ChartData = {
    labels: students.map(student => `${student.name} ${student.surname}`),
    datasets: [
      {
        label: `Posts in ${period}`,
        data: students.map(student => countPosts(student, period)),
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Posts Chart</h2>
      <Line key={JSON.stringify(data)} data={data} />
    </div>
  );
};

export default StatisticsChart;
