'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { fetcher } from '@/lib/api';
import SliderMenu from '@/app/components/slider-menu';
import Posts from '@/app/components/posts/posts';
import TagsFilter from '@/app/components/tags-filter/small';
import ImagePost from '@/app/components/posts/image-post';
import { useUser } from '../components/context';

interface PostsProps {
    data: DataPosts[]
  }

interface DataPosts {
id: number,
attributes: {
    title: string,
    url_view: string;
    worktype: {
    data: {
        id: number,
        attributes: {
        name: string
        }
    }
    };
    tags: {
        some(arg0: (tag: any) => boolean): boolean;
        length: number;
        data: {
            id: number,
            attributes: {
                name: string
            }
        }[]
    }
}
}

interface DataStudent {
    attributes: {
      id: number;
      login: string;
      group: string;
      surname: string;
      name: string;
      course: number;
      posts: {
        data: DataPosts[];
      }
    }
  }


export default function Portfolio() {
    const [student, setStudent] = useState<DataStudent>();
    const [posts, setPosts] = useState<PostsProps>();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [filteredPostType, setFilteredPostTypes] = useState<string | null>(null);
    const [checkboxChecked, setCheckboxChecked] = useState<boolean>(true);
    const [filteredPost, setFilteredPost] = useState<string[]>([]);
    const { userId } = useUser();
    const [worktypes, setWorktypes] = useState<string[]>([]);

    const fetchStudentData = async () => {
        if (!userId) {
            console.error('userId не найден');
            return;
        }
    }

    const handleFiltersChange = (selectedFilters: string[]) => {
        setSelectedTags(selectedFilters);
    };


    useEffect(() => {
        const fetchData = async () => {
            const studentsData = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${userId}?populate=*`);
            const worktypesData = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/worktypes`)
            
            setStudent(studentsData);
            setPosts(studentsData.data.attributes.posts);
            const namesWorktypes = worktypesData.data.map((worktype: any) => worktype.attributes.name);   
            setWorktypes(namesWorktypes);
          };
        fetchData();
      }, [userId]);

      const filteredPosts = useMemo(() => {
        if (!posts) return [];

        return posts.data.filter((post) => {
          return (
            post.attributes.worktype?.data?.attributes?.name === 'Проекты' &&
            (filteredPost.length === 0 ||
              post.attributes.tags.some((tag) =>
                filteredPost.includes(tag)
              )) &&
            (checkboxChecked || post.attributes.tags.length > 0)
          );
        });
      }, [posts, filteredPost, checkboxChecked]);



    return (
    <div className="flex flex-col">
        <div className="flex items-start px-11 pb-5 max-sm:pb-0 max-sm:px-4">
            <button onClick={() => console.log(posts)}>posts</button>
            <button onClick={() => console.log(student)}>student</button>
            <div className="px-11 pb-6 max-sm:pb-1 max-sm:px-4">
                <SliderMenu values={worktypes} setSelectedCategory={setFilteredPost} setCheckboxChecked={setCheckboxChecked} checkboxChecked={checkboxChecked}/>
            </div>
            {/* фильтр по тегам как в гитхабе */}
            <div className="w-[12rem]">
                <TagsFilter onFiltersChange={handleFiltersChange} />
            </div>

            <div className='px-11 pb-10 grid grid-cols-3 gap-4 max-sm:gap-6 max-sm:p-6 max-xl:grid-cols-2 max-sm:grid-cols-1'>
                {filteredPosts && filteredPosts.length > 0 && filteredPosts.map((post: any) => {
                return (
                    <ImagePost 
                    key={post.attributes.url_view}
                    url_view={post.attributes.url_view} 
                    title={post.attributes.title}
                    />
                )
                })}
            </div>
        </div>
    </div>
    );
}