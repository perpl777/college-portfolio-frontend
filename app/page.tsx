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
  const [tags, setTags] = useState<TagsProps[]>([]);  
  const [tagsNames, setTagsNames] = useState<string[]>([]);  
  const [categories, setCategories] = useState<CategoryProps[]>([]); 
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [checkboxChecked, setCheckboxChecked] = useState<boolean>(true);
  const [filteredPost, setFilteredPost] = useState<string[]>([]);
  

  useEffect(() => {
    const fetchData = async () => {
        let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?populate=worktype,tags&fields=title&fields=url_view`);    
        setPosts(postsResponse);
        
        let tagsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/tags?populate=categories&fields=name`);        
        const namesTags = tagsResponse.data.map((tag: any) => tag.attributes.name);      
        setTags(tagsResponse.data)   
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
        post.attributes.worktype.data.attributes.name === 'Проекты' &&
        (filteredPost.length === 0 ||
          post.attributes.tags.data.some((tag: any) =>
            filteredPost.includes(tag.attributes.name)
          )) 
        &&
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
  );
}