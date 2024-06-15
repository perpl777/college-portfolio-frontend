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
    tags: {
      data: {
        some(arg0: (tag: any) => boolean): unknown;
        id: number,
        attributes: {
          name: string
        }
      }
    }
  }
}

export default function Home() {

  const [posts, setPosts] = useState<PostsProps>();
  const [tags, setTags] = useState<string[]>([]);  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredPostTags, setFilteredPostTags] = useState<string[]>([]);

  const postsTypes = [
    'Дизайн',
    'Печать',
    'Программирование',
    'Фотография',
  ]

  
  useEffect(() => {
    const fetchData = async () => {
        let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?populate=worktype,tags&fields=title&fields=url_view`);    
        setPosts(postsResponse);
        
        let tagsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/tags?fields=name`);        
        const names = tagsResponse.data.map((tag: any) => tag.attributes.name);         
        setTags(names);       
      };     
      fetchData();   
    }, []);


  const filteredPosts = useMemo(() => {
    if (!posts) return [];
  
    let filteredData = posts.data?.filter((post: any) => {
      return (
        post.attributes.worktype.data.attributes.name === 'Проекты' &&
        (filteredPostTags.length === 0 ||
          post.attributes.tags.data.some((tag: any) =>
            filteredPostTags.includes(tag.attributes.name)
          ))
      );
    });
  
    return filteredData;
  }, [posts, filteredPostTags]);


  const handleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
        setSelectedTags([...selectedTags, tag]);
    }

    if (filteredPostTags.includes(tag)) {
      setFilteredPostTags(filteredPostTags.filter(t => t !== tag));
    } else {
      setFilteredPostTags([...filteredPostTags, tag]);
    }
  };


  return (
    <div>
      <Header />
      <div className='px-11 pt-12 pb-12 space-y-10 max-sm:p-6 max-sm:pt-10 max-sm:space-y-6 max-lg:space-y-10'>
        <SliderMenu values={postsTypes} updateFilteredValues={setFilteredPostTags}/>
        <Tags tags={tags} filteredPostTags={filteredPostTags} handleTagFilter={handleTagFilter} selectedTags={selectedTags}/>
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