export type Period = 'week' | 'month' | 'year';

export interface Student {
  id: number;
  login: string;
  group: string;
  surname: string;
  name: string;
  course: number;
  posts: Post[];
}

export interface StatisticsData {
  students: Student[];
  period: Period;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

interface Post {
  publishedAt: string;
  title: string;
}