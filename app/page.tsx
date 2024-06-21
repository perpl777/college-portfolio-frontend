'use client'
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { fetcher } from '@/lib/api';

import Loading from './loading'

import ImagePost from './components/posts/image-post';
import SliderMenu from "./components/slider-menu";
import Header from './components/header'
import Tags from "./components/tags"


interface PostsProps {
  data: DataPosts[]
}


interface DataPosts {
  id: number,
  attributes: {
    title: string,
    url_view: string;
    published: boolean;
    student: {
      data: {
        id: number
      }
    }
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


interface CategoryProps {
  id: number,
  attributes: {
    name: string,
    tags: {
      data: {
        id: number,
        attributes: {
          name: string
        }
      }
    };
  }
}


interface TagsProps {
  id: number,
  attributes: {
    name: string,
    categories: {
      data: {
        id: number,
        attributes: {
          name: string
        }
      }
    };
  }
}


export default function Home() {

  const [posts, setPosts] = useState<PostsProps>();
  const [filteredPost, setFilteredPost] = useState<string[]>([]);

  const [tags, setTags] = useState<TagsProps[]>([]);  
  const [tagsNames, setTagsNames] = useState<string[]>([]); 
  const [selectedTags, setSelectedTags] = useState<string[]>([]); 

  const [categories, setCategories] = useState<CategoryProps[]>([]); 
  const [selectedCategory, setSelectedCategory] = useState<string>();

  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(true);

  //фетчи
  useEffect(() => {
    const fetchData = async () => {
        let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?populate=worktype,tags,student&fields=title&fields=url_view&fields=published`);    
        setPosts(postsResponse);
        
        let tagsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/tags?populate=categories&fields=name`);        
        setTags(tagsResponse.data)  

        const namesTags = tagsResponse.data.map((tag: any) => tag.attributes.name);      
        setTagsNames(namesTags);  
        
        let categoriesResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/categories?populate=*`);        
        const namesCategories = categoriesResponse.data.map((category: any) => category.attributes.name);         
        setCategories(namesCategories); 
        setSelectedCategory(namesCategories[0])
      };     
    fetchData();   
  }, []);

  
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let filteredData = posts.data?.filter((post: any) => {
      return (
        //если посты проекты и статус published
        post.attributes.worktype.data.attributes.name === 'Проекты' && post.attributes.published &&
        //фильтр по тэгам
        (filteredPost.length === 0 ||
          post.attributes.tags.data.some((tag: any) =>
            filteredPost.includes(tag.attributes.name)
          )) 
        &&
        //фильтр по категориям + чекбокс
        (checkboxChecked ||
          tags.some((tag: any) =>
            tag.attributes.categories.data.some((category: any) =>
              category.attributes.name === selectedCategory &&
              post.attributes.tags.data.some((postTag: any) =>
                postTag.attributes.name === tag.attributes.name
              )
            )
          ))
        );
    });
    return filteredData;
  }, [posts, filteredPost, categories, tags, selectedCategory, checkboxChecked]);


  //фильтр по тэгам
  const handleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    if (filteredPost.includes(tag)) {
      setFilteredPost(filteredPost.filter(t => t !== tag));
    } else {
      setFilteredPost([...filteredPost, tag]);
    }
  };


  return (
    <div>
      <Header /> 
      <div className='px-11 pt-12 pb-12 space-y-10 max-sm:p-6 max-sm:pb-5 max-sm:pt-10 max-sm:space-y-5 max-lg:space-y-10'>
        <SliderMenu 
          values={categories} 
          setSelectedCategory={setSelectedCategory} 
          checkboxChecked={checkboxChecked}
          setCheckboxChecked={setCheckboxChecked}
        />
        <Tags 
          tags={tagsNames} 
          filteredPost={filteredPost} 
          handleTagFilter={handleTagFilter} 
          selectedTags={selectedTags}
        />
      </div>
      <div className='px-11 pb-12 grid grid-cols-3 gap-4 max-sm:gap-6 max-sm:p-6 max-xl:grid-cols-2 max-sm:grid-cols-1'>
        {filteredPosts && filteredPosts.length > 0 && filteredPosts.map((post: any) => {
          return (
            <Suspense fallback={<Loading />}>
              <ImagePost 
                href={`/portfolio/${post.attributes.student.data.id}/post/${post.id}`}
                studentId={post.attributes.student.data.id}
                postId={post.id}
                url_view={post.attributes.url_view} 
                title={post.attributes.title}
              />
            </Suspense>
          )
        })}
      </div>
    </div>
  );
}