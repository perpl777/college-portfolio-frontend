import Link from 'next/link'


interface Props {
    id: number
    posts: DataPosts[]
}

interface DataPosts {
    id: number,
    attributes: {
        title: string,
        description?: string,
        link?: string,
        markupWithBackground: boolean,
        publishedAt: string,
        author: {
            data: {
                id: number
            }
        },
        work_type: {
            data: {
                id: number,
                attributes: {
                    name: string
                }
            }
        },
        photo?: {
            data: {
                id: number,
                attributes: {
                    name: string,
                    width: number,
                    height: number,
                    url: string
                }
            }
        },
        file?: {
            data: {
                id: number;
                attributes: {
                    name: string;
                    url: string;
                };
            };
        }
    }
}

const PostsTable = ({id, posts}: Props) => {
    return (
        <table className="table table-lg m-auto mt-8">
            <thead>
                <tr>
                <th className='border-b border-black text-sm text-slate-400 w-52 font-normal leading-6'> 
                    Дата
                </th>
                <th className='border-b border-black text-sm text-slate-400 w-72 font-normal leading-6'> 
                    Название
                </th>
                <th className='border-b border-black text-sm text-slate-400 w-24 font-normal leading-6'> 
                    Тип
                </th>
                </tr>
            </thead>
            <tbody>

            {posts.map((post: any, index: number) =>
                <tr key={index} className='border-b border-black hover:bg-stone-100 transition-all  active:bg-gray-800 active:text-gray-300 active:duration-75'>
                    <td>{post.attributes.publishedAt.slice(0, 10)}</td>
                    <td><Link href={`/admin/portfolioes/${id}/edit-post/${post.id}`}>{post.attributes.title}</Link></td>
                    <td>{post.attributes.work_type?.data?.attributes?.name}</td>
                </tr>
            )}
            </tbody>
        </table>
    )
}

export default PostsTable