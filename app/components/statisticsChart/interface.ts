export type Period = 'неделя' | 'месяц' | 'год';

export interface Student {
  attributes: {
    id: number;
    login: string;
    group: string;
    surname: string;
    name: string;
    course: number;
    posts: {
      data: Post[];
    }
  }
}

export interface StatisticsData {
  students: Student[];
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
  attributes: {
    publishedAt: string;
    title: string;
  }
}