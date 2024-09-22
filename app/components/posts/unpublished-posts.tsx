import React, { Suspense } from 'react';
import Loading from '../../loading'

import ImagePost from '../../components/posts/image-post';

interface Props {
    filteredPosts: any
}

export default function UnpublishedPosts({filteredPosts}: Props) {
    return (
        <div>
            {(filteredPosts && filteredPosts.length !== 0) 
            ? 
                <div className='px-11 pb-10 w-full grid grid-cols-3 gap-4 max-sm:gap-6 max-sm:p-6 max-xl:grid-cols-2 max-sm:grid-cols-1'>
                    {filteredPosts.map((post: any) => {
                        return (<>
                            <Suspense fallback={<Loading />}>
                                <ImagePost 
                                    href={`/moderation/post/${post?.id}`}
                                    studentId={post.attributes.student.data.id}
                                    postId={post.id}
                                    photo={post?.attributes?.photo?.data?.attributes?.url}
                                    title={post.attributes.title}
                                />
                            </Suspense>
                        </>)
                    })}
                </div>
            : 
                (<div className="text-center text-zinc-400 text-lg mt-16">Все посты проверены</div>)
            }
        </div>
    );
}