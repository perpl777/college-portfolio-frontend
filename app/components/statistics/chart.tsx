import React, { useEffect, useState } from 'react'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Student, StatisticsData, ChartData, Period } from './interface'
import { generateChartData } from './chartFunctions'

import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

const options = {
	plugins: {
		legend: {
			display: false,
		},
	},
	scales: {
		y: {
			ticks: {
				precision: 0, // Количество десятичных знаков
				beginAtZero: true, // Начинать ось с 0
			},
		},
		x: {
			ticks: {
				beginAtZero: true, // Начинать ось с 0
			},
		},
	},
	responsive: true,
	maintainAspectRatio: false,
}

const StatisticsChart: React.FC<StatisticsData> = ({ students }) => {
	const [currentPeriod, setCurrentPeriod] = useState<Period>('неделя')
	const [displayedPeriod, setDisplayedPeriod] = useState('')
	const [chartData, setChartData] = useState<ChartData>(() => generateChartData(students, currentPeriod))

	useEffect(() => {
		// Обновление данных при первоначальной загрузке и при смене периода
		setChartData(generateChartData(students, currentPeriod))
	}, [students, currentPeriod])

	const handlePeriodChange = (event: React.MouseEvent<HTMLButtonElement>,newPeriod: Period) => {
		event.preventDefault()
		setCurrentPeriod(newPeriod)
	}

	const handleChangePeriod = (period: Period) => {
		setCurrentPeriod(period)
	}

	const handleChange = (event: any) => {
		handleChangePeriod(event.target.value)
		const text = ChangeText(event.target.value).toString
		setDisplayedPeriod(event.target.value)
		// setDisplayedPeriod('text')
		console.log("f", displayedPeriod)
	}

	const ChangeText = (currentPeriod: Period) => {
		switch (currentPeriod) {
			case 'неделя':
				return 'Посты за последнюю неделю'
			case 'месяц':
				return 'Посты за последний месяц'
			case 'год':
				return 'Посты за последний год'
			default:
				return 'Посты'
		}
	}

	return (
		<div>
			<div className='py-5 flex justify-end max-sm:justify-center max-sm:pb-10'>
				{/* <div className='dropdown dropdown-end'>
					<div
						tabIndex={0}
						role='button'
						className='text-left btn flex-nowrap flex pl-3 py-2 w-64 border border-slate-900 bg-white rounded-sm hover:bg-slate-100 hover:border-slate-900 '
					>
						{ChangeText(currentPeriod)}
					</div>
					<ul
						tabIndex={0}
						className='dropdown-content z-[1] menu w-[16em] px-5 shadow bg-base-100 rounded-sm w-52'
					>
						<li>
							<button
								className='btn bg-white rounded-sm border-none shadow-none hover:bg-white font-light hover:font-bold'
								onClick={(event) => handlePeriodChange(event, 'неделя')}
							>
								неделя
							</button>
						</li>
						<li>
							<button
								className='btn bg-white rounded-sm border-none shadow-none hover:bg-white font-light hover:font-bold'
								onClick={(event) => handlePeriodChange(event, 'месяц')}
							>
								месяц
							</button>
						</li>
						<li>
							<button
								className='btn bg-white rounded-sm border-none shadow-none hover:bg-white font-light hover:font-bold'
								onClick={(event) => handlePeriodChange(event, 'год')}
							>
								год
							</button>
						</li>
					</ul>
				</div> */}
				<Box className="max-w-xs w-full max-lg:max-w-xs">
					<FormControl fullWidth>
						<InputLabel id='demo-simple-select-label'>Период</InputLabel>
						<Select
							labelId='demo-simple-select-label'
							id='demo-simple-select'
							value={displayedPeriod}
							label={'Период'}
							onChange={handleChange}
						>
							<MenuItem value={'неделя'}>Неделя</MenuItem> 
							<MenuItem value={'месяц'}>Месяц</MenuItem> 
							<MenuItem value={'год'}>Год</MenuItem> 
						</Select>
				</FormControl>
			</Box>
			</div>
			<div className='flex justify-center'>
				<div className='flex justify-center relative w-[80%]  h-[50vh] max-sm:w-full'>
					<Line
						className='relative'
						key={JSON.stringify(chartData)}
						data={chartData}
						options={options}
					/>
				</div>
			</div>
		</div>
	)
}

export default StatisticsChart
