'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { fetcher } from '@/lib/api';
import Image from 'next/image'
import IconEditStudent from '@/public/editstudent.svg'
import Link from 'next/link'
import { Suspense } from 'react'
import Loading from '@/app/loading'
import ButtonStroke from '../../components/btn'
import HeaderMin from '../../components/header-min'
import Filter from '@/app/components/filter'
import PostsTable from '../../components/posts-table'
import ModalEditPortfolio from '../../components/modal-edit-student';


interface Props {
  params: {id: number};
}


interface DataStudent {
  id: number,
  attributes: {
      surname: string,
      name: string,
      course: number,
      description: string,
      technologies: string,
      linkToGit?: string,
      linkToBehance?: string,
      linkToVK?: string,
      specialty: string,
      profilePicture: {
          data: {
              id: number,
              attributes: {
                  name: string,
                  width: number,
                  height: number,
                  url: string
              }
          }
      }
  }
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

interface PostsProps {
  data: DataPosts[]
}


const Portfolioes = ({params: {id}}: Props) => {

  const postsTypes = [
    "Все",
    "Проекты",
    "Достижения",
    "Курсы", 
    "Стажировки", 
    "Спорт",
    "Волонтерство"
  ]

  const [openModal, setOpenModal] = useState(false);

  let [student, setStudent] = useState<DataStudent>();
  const [posts, setPosts] = useState<PostsProps>();
  const [filteredPostType, setFilteredPostTypes] = useState<string | null>(null);


  useEffect(() => {
      const fetchData = async () => {
          let postsResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/works?filters[author][id][$eq]=${id}&populate=*`);   
          const studentResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${id}/?populate=*`);
          // console.log(studentResponse)
          setStudent(studentResponse.data);
          setPosts(postsResponse);
      };
  fetchData();
  }, []);

  
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let filteredData = posts.data;
    
    // Фильтрация по типам
    if (filteredPostType) {
      filteredData = filteredData.filter(post => post.attributes.work_type.data.attributes.name === filteredPostType);
    }

    return filteredData;
  }, [posts, filteredPostType]);

  const handleOpenModal = () => {
      setOpenModal(!openModal);
  };

  const handleCloseModal = () => {
      setOpenModal(false);
  };
  

  return (
    <> 
      <HeaderMin title='Портфолио студента'/>

      {/* редактирование профиля */}
      <div className='flex gap-5 items-end pb-14'>
        <h3 className='text-3xl font-semibold'>
        <Suspense fallback={<Loading />}>
          {student && `${student.attributes.name} ${student.attributes.surname}`}
        </Suspense>
        </h3>
        <button onClick={handleOpenModal}>
          <Image src={IconEditStudent} alt="edit"></Image>
        </button>
      </div>

      <div className='flex justify-between gap-10 flex-wrap'>
        <Link href={`/admin/publication/${id}`}>
          <ButtonStroke text="+ Добавить"/>
        </Link>
        <Filter values={postsTypes} updateFilteredValues={setFilteredPostTypes} type='rounden-lg'/>
      </div>

      {/* модалка редактирования студента */}
      <ModalEditPortfolio id={id} openModal={openModal} handleCloseModal={handleCloseModal}/>

      { posts && 
        <Suspense fallback={<Loading/>}>
          <PostsTable id={id} posts={filteredPosts}/>
        </Suspense> 
      }   
    </>
  )
}

export default Portfolioes