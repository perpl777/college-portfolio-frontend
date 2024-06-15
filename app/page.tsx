'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { fetcher } from '@/lib/api';
import SliderMenu from "./components/slider-menu";
import Header from './components/header'
import Tags from "./components/tags"
import ImagePost from './components/posts/image-post';


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
    post_tag: {
      id: number
    };
  }
}

interface TagsProps {
  data: TagsPosts[];
}

interface TagsPosts {
  id: number,
  attributes: {
    name: string,
  }
}


export default function Home() {

  const [posts, setPosts] = useState<PostsProps>();
  const [tags, setTags] = useState<TagsProps>();
  const [filteredPostType, setFilteredPostTypes] = useState<string | null>(null);

  const postsTypes = [
    'Дизайн',
    'Печать',
    'Программирование',
    'Фотография',
  ]

  // запрос к названию, фото и типу работы постов
  useEffect(() => {
    const fetchData = async () => {
        let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?populate=worktype,post_tag,student&fields=title&fields=url_view`);   
        let tagsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/tags?fields=name`);    
        setPosts(postsResponse);
        setTags(tagsResponse)
      };
    fetchData();
  }, []);


  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    let filteredData = posts.data?.filter(post => post.attributes.worktype.data.attributes.name === 'Проекты');
        
    return filteredData;
  }, [posts]);


  return (
    <div>
      <Header />
      <div className='px-11 pt-12 pb-12 space-y-10 max-sm:p-6 max-sm:pt-10 max-sm:space-y-6 max-lg:space-y-10'>
      <SliderMenu values={postsTypes} updateFilteredValues={setFilteredPostTypes}/>
        <Tags tags={tags}/>
      </div>
      <div className='px-11 pb-10 grid grid-cols-3 gap-4 max-sm:p-6 max-xl:grid-cols-2 max-sm:grid-cols-1'>
        {filteredPosts && filteredPosts.length > 0 && filteredPosts.map((post: any) => {
          return (
            <ImagePost 
              url_view={post.attributes.url_view} 
              title={post.attributes.title}
              worktype={post.attributes.worktype.data?.attributes?.name}
            />
          )
        })}
      </div>
    </div>
  );
}