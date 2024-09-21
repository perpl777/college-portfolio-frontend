import React, { useEffect, useState } from 'react'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	ChartOptions,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { StatisticsData, ChartData, Period } from '../interfaces/statistics'
import { generateChartData } from './chartFunctions'

import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

const options: ChartOptions<'line'> = {
	responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true, // This should be placed directly under the scale
      ticks: {
        precision: 0, // Number of decimal places
      },
    },
    x: {
      // beginAtZero is not applicable here directly but for consistency keep it under ticks
      ticks: {
      },
    },
  },
};

const StatisticsChart: React.FC<StatisticsData> = ({ students }) => {
	const defaultPeriod: Period = 'неделя';
	const [currentPeriod, setCurrentPeriod] = useState<Period>(defaultPeriod);
	const [displayedPeriod, setDisplayedPeriod] = useState<Period>(defaultPeriod);
	const [chartData, setChartData] = useState<ChartData>(() => generateChartData(students, currentPeriod));
  
	useEffect(() => {
	  setChartData(generateChartData(students, currentPeriod));
	}, [students, currentPeriod]);
  
	const handleChange = (event: SelectChangeEvent<Period>) => {
	  const period = event.target.value as Period;
	  setCurrentPeriod(period);
	  setDisplayedPeriod(period);
	};
  
	return (
	  <div>
		<div className='py-5 flex justify-end max-sm:justify-center max-sm:pb-10'>
		  <Box className="max-w-xs w-full max-lg:max-w-xs">
			<FormControl fullWidth>
			  <InputLabel id='period-select-label'>Период</InputLabel>
			  <Select
				labelId='period-select-label'
				id='period-select'
				value={displayedPeriod}
				label='Период'
				onChange={handleChange}
			  >
				<MenuItem value='неделя'>Неделя</MenuItem>
				<MenuItem value='месяц'>Месяц</MenuItem>
				<MenuItem value='год'>Год</MenuItem>
			  </Select>
			</FormControl>
		  </Box>
		</div>
		<div className='flex justify-center'>
		  <div className='flex justify-center relative w-[80%] h-[50vh] max-sm:w-full'>
			<Line
			  className='relative'
			  key={JSON.stringify(chartData)}
			  data={chartData}
			  options={{}} // добавьте ваши параметры для графика
			/>
		  </div>
		</div>
	  </div>
	);
  };
  

export default StatisticsChart
