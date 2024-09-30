export type Period = 'неделя' | 'месяц' | 'год';

export interface Student {
    id: number;
    attributes: {
      id: number;
      login: string;
      group: string;
      name: string;
      surname: string;
      patronymic: string;
      convergence?: {
        data: {
            id: number;
            attributes: {
                name: string;
                course: any;
                full_name: string;
            }
        }
      }
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
    id: number;
    publishedAt: string;
    createdAt: string;
    title: string;
  }
}

interface Specialization {
  data: {
      attributes: {
          name: string;
      }
  }
}
