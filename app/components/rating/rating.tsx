import { Student } from '../interfaces/statistics';

export const getFiltredStudents = (students: Student[]) => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Разделяем студентов на тех, кто имеет посты за последний месяц, и тех, кто не имеет
    const studentsWithPostsLastMonth = students.filter(student => {
        const posts = student.attributes.posts.data;
        return posts.some(post => {
            const postDate = new Date(post.attributes.createdAt); 
            return postDate >= oneMonthAgo && postDate <= now;
    // Проверяем, что дата поста попадает в промежуток одного месяца
        });
    });

    // Фильтруем студентов, у которых нет постов за последний месяц
    const studentsWithoutRecentPosts = students.filter(student => {
        const posts = student.attributes.posts.data;
        return !posts.some(post => {
            const postDate = new Date(post.attributes.createdAt); 
            return postDate >= oneMonthAgo && postDate <= now;
        });
    });
    // Объединяем два массива: сначала те, у кого есть посты, потом те, у кого нет
    const sortedStudents = [...studentsWithPostsLastMonth, ...studentsWithoutRecentPosts];

    // Возвращаем отсортированный список студентов
    return sortedStudents;
}
