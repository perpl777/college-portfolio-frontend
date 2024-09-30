import { ChartData, Period, Student } from '../interfaces/statistics';
import { format, subDays, subMonths } from 'date-fns';



export const generateChartData = (students: Student[], period: Period): ChartData => {
  const now = new Date();
  let labels: string[] = [];

  if (period === 'неделя') {
    // Последние 7 дней
    for (let i = 6; i >= 0; i--) {
      labels.push(format(subDays(now, i), 'dd-MM'));
    }
  } else if (period === 'месяц') {
    // Последние 30 дней, каждые 3 дня
    for (let i = 30; i >= 0; i -= 3) {
      labels.push(format(subDays(now, i), 'dd-MM'));
    }
  } else if (period === 'год') {
    // Последние 12 месяцев
    for (let i = 11; i >= 0; i--) {
      labels.push(format(subMonths(now, i), 'MM-yyyy'));
    }
  }

  const data = labels.map(label => {
    let count = 0;

    students.forEach(student => {
      const { posts } = student.attributes;
      posts.data.forEach(post => {
        if (post.attributes.published) {
          const postDate = new Date(post.attributes.publishedAt);
          if (period === 'неделя' || period === 'месяц') {
            if (format(postDate, 'dd-MM') === label) {
              count++;
            }
          } else if (period === 'год') {
            if (format(postDate, 'MM-yyyy') === label) {
              count++;
            }
          }
        }
      });
    });

    return count;
  });

  return {
    labels,
    datasets: [
      {
        label: '',
        data,
        backgroundColor: 'rgba(100, 150, 200, 0.8)',
        borderColor: 'rgba(100, 150, 200, 0.8)',
        borderWidth: 2,
      },
    ],
  };
};



// пока не используется
export const createLineChartData = (): ChartData => {
    return {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
            {
                label: 'Revenue',
                data: [15, 29, 50, 51],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };
};