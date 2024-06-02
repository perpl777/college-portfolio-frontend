'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { fetcher } from '@/lib/api';
import SliderMenu from "./components/slider-menu";
import Header from './components/header'
import Tags from "./components/tags"
import ImagePost from './components/posts/image-post';


interface DataPosts {
  id: number,
  attributes: {
      title: string,
      description?: string,
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

interface PostsProps {
  data: DataPosts[]
}


export default function Home() {

  const [posts, setPosts] = useState<PostsProps>();

  const [filteredPostType, setFilteredPostTypes] = useState<string | null>(null);

  const postsTypes = [
    'Дизайн',
    'Программирование',
    'Печать',
    'Фотография',
  ]

  useEffect(() => {
    const fetchData = async () => {
        let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/works?populate=*`);   
        setPosts(postsResponse);
      };
    fetchData();
  }, []);


  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let filteredData = posts.data;
    // if (filteredPostType) {
    //     filteredData = filteredData.filter(post => post.attributes.work_type.data.attributes.name === filteredPostType);
    // }
    return filteredData;
  }, [posts, filteredPostType]);


  return (
    <div>
      <Header />

      <div className='px-11 pt-12 pb-10 space-y-9 max-sm:p-6 max-sm:pt-10 max-sm:space-y-6 max-lg:space-y-10'>
        <SliderMenu values={postsTypes} updateFilteredValues={setFilteredPostTypes}/>
        <Tags/>
      </div>

      <div className='px-11 grid grid-cols-3 gap-4 max-sm:p-6 max-xl:grid-cols-2 max-sm:grid-cols-1'>
        {filteredPosts && filteredPosts.length > 0 && filteredPosts.map((post: any) => {
          return (
              <div className=''>
                  <ImagePost 
                    photo={post.attributes.photo?.data?.attributes?.url} 
                    title={post.attributes.title}
                    work_type={post.attributes.work_type.data?.attributes?.name}
                  />
              </div>
          )
        })}
      </div>
    </div>
  );
}