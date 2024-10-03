import { Student } from '../interfaces/statistics';

export const getFiltredStudents = (students: Student[]) => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Разделяем студентов на тех, кто имеет опубликованные посты за последний месяц
    const studentsWithPostsLastMonth = students.filter(student => {
        const posts = student.attributes.posts.data;
        return posts.some(post => {
            const postDate = new Date(post.attributes.createdAt);
            const isPublished = post.attributes.published;
            return isPublished && postDate >= oneMonthAgo && postDate <= now;
        });
    });

    // Фильтруем студентов, у которых нет опубликованных постов за последний месяц
    const studentsWithoutRecentPosts = students.filter(student => {
        const posts = student.attributes.posts.data;
        return !posts.some(post => {
            const postDate = new Date(post.attributes.createdAt);
            const isPublished = post.attributes.published;
            return isPublished && postDate >= oneMonthAgo && postDate <= now;
        });
    });

    // Сортируем первую группу студентов по количеству опубликованных постов за последний месяц в порядке убывания
    studentsWithPostsLastMonth.sort((a, b) => {
        const postsA = a.attributes.posts.data.filter(post => {
            const postDate = new Date(post.attributes.createdAt);
            const isPublished = post.attributes.published;
            return isPublished && postDate >= oneMonthAgo && postDate <= now;
        }).length;

        const postsB = b.attributes.posts.data.filter(post => {
            const postDate = new Date(post.attributes.createdAt);
            const isPublished = post.attributes.published;
            return isPublished && postDate >= oneMonthAgo && postDate <= now;
        }).length;

        return postsB - postsA;
    });

    // Сортируем вторую группу студентов по общему количеству опубликованных постов в порядке убывания
    studentsWithoutRecentPosts.sort((a, b) => {
        const postsA = a.attributes.posts.data.filter(post => post.attributes.published).length;
        const postsB = b.attributes.posts.data.filter(post => post.attributes.published).length;

        return postsB - postsA;
    });

    // Объединяем два массива: сначала те, у кого есть опубликованные посты за последний месяц, потом те, у кого нет
    const sortedStudents = [...studentsWithPostsLastMonth, ...studentsWithoutRecentPosts];

    // Возвращаем отсортированный список студентов
    return sortedStudents;
}
