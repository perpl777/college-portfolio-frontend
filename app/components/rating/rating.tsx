interface Post {
    attributes: {
        id: number;
        title: string;
        createdAt: string;
    }
}

interface Specialization {
    data: {
        attributes: {
            name: string;
        }
    }
}

interface DataStudent {
    id: number;
    attributes: {
        surname: string;
        name: string;
        patronymic: string;
        specialization: Specialization;
        posts: {
            data: Post[];
        }
    }
}

interface StudentProps {
    data: DataStudent[];
}

export const getFiltredStudents = (students: DataStudent[]) => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Разделяем студентов на тех, кто имеет посты за последний месяц, и тех, кто не имеет
    const studentsWithPostsLastMonth = students.filter(student => {
        const posts = student.attributes.posts.data;
        return posts.some(post => {
            const postDate = new Date(post.attributes.createdAt); 
            return postDate >= oneMonthAgo && postDate <= now;
        });
    });


    const studentsWithoutRecentPosts = students.filter(student => {
        const posts = student.attributes.posts.data;
        return !posts.some(post => {
            const postDate = new Date(post.attributes.createdAt); 
            return postDate >= oneMonthAgo && postDate <= now;
        });
    });
    const sortedStudents = [...studentsWithPostsLastMonth, ...studentsWithoutRecentPosts];

    
    return sortedStudents;
}
