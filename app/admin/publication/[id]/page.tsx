'use client'
import React, {useState} from 'react';
import {getAuthData} from "@/lib/auth"
import {fetcher} from "@/lib/api"
import { ChangeEvent, useRef } from 'react';
import HeaderMin from '../../components/header-min'
import Link from 'next/link'
import Filter from '@/app/components/filter';


interface Props {
  params: {id: number};
}

interface DataStudent {
  title: string;
  description: string;
  link?: string;
  work_type: string;
  markupWithBackground?: boolean;
}

const Publication = ({params: {id}}: Props) => {

  const { jwt } = getAuthData();

  const [workType, setWorkType] = useState<string | null>(null);
  
  const work_types = [
    {name: 'Проекты', id: 8},
    {name: 'Достижения', id: 7},
    {name: 'Курсы', id: 9},
    {name: 'Стажировки', id: 10},
    {name: 'Спорт', id: 11},
    {name: 'Волонтерство', id: 12}
  ]

  const [formData, setFormData] = useState<DataStudent>({
    title: '',
    description: '',
    link: '',
    work_type: '',
    markupWithBackground: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [blobPhoto, setblobPhoto] = useState<Blob | null>(null);
  const [blobFile, setBlobFile] = useState<File | null>(null);


  const handleButtonClick = () => {
    window.location.href=`/admin/portfolioes/${id}` 
  };

  const handleInputChange = (event: React.ChangeEvent<any>) => {
      const { name } = event.target;
      setFormData({
          ...formData,
          [name]: event.target.value,
      });
  };

  //для загурузки фото
  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
        return;
    }
    setblobPhoto(file);
  };
  const handleClickPhoto = () => {
      photoInputRef.current?.click();
  };

  
//для загурузки файла
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    setBlobFile(file);
  };

  const handleClickFile = () => {
      fileInputRef.current?.click();
  };


  const handleSubmit = async (event: any) => {
    event.preventDefault()
    try {
      const response = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/works`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            title: formData.title,
            description: formData.description,
            link: formData.link,
            work_type: 8,
            markupWithBackground: formData.markupWithBackground,
            author: id
          }
        }),
      });

      console.log('adding work');
    } 
    catch (error) {
      console.error('Error adding:', error);
    }
  };

  
  return (
    <div>
      <HeaderMin title='Опубликовать'/>
      <div className='flex flex-col w-full box-border'>
        <form onSubmit={handleSubmit}>
          <div className='flex justify-between max-[1200px]:flex-wrap'>
            <div className='flex pr-16 w-[600px] max-xl:w-[500px] flex-col max-[700px]:w-[400px]  max-[500px]:w-[300px]'>

              <div className='mb-5 max-[500px]:mb-0'>
                <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                    <input 
                      type="text" 
                      name="title"
                      className="grow outline-none p-2 w-full" 
                      placeholder={'Название..'}
                      value={formData.title}
                      onChange={(e) => handleInputChange(e)}
                    />
                </label>
              </div>
              <div className='mb-5 max-[500px]:mb-0'>
                <label className="my-5 border-b border-gray-500 flex gap-2 items-center w-full">
                  <input 
                    type="text" 
                    name="link"
                    className="grow outline-none p-2 w-full" 
                    placeholder={'Ссылка..'}
                    value={formData.link}
                    onChange={(e) => handleInputChange(e)}
                  />
                </label>
              </div>
              <div className='mb-5 max-[500px]:mb-5'>
                <label className="my-5 border border-gray-500 flex gap-2 items-center  w-full">
                  <textarea 
                    name="description"
                    className="grow outline-none px-5 pt-5 rounded-sm" 
                    placeholder={'Описание..'} 
                    style={{ whiteSpace: "nowrap", overflow: "hidden" }}
                    value={formData.description}
                    onChange={(e) => handleInputChange(e)}
                  />
                </label>
              </div>
              <div className='mb-10 max-[500px]:mb-5'>
                <div className='flex rounded-xl border border-gray-800 h-12 w-[320px]'>
                  <button
                    className='bg-black rounded-l-xl flex items-center justify-center w-1/2 cursor-pointer text-gray-500 text-md'
                    onClick={handleClickFile}
                  >
                    Выбрать файл
                  </button>
                  <Link href={blobFile ? URL.createObjectURL(blobFile) : ''} target='_blank' className="rounded-r-xl px-3 flex items-center w-1/2">
                    <button
                      onClick={handleClickFile}
                      className='overflow-hidden whitespace-nowrap text-ellipsis w-11/12 cursor-pointer outline-none text-gray-600 text-sm'>
                      {blobFile ? <p>{blobFile.name}</p> : 'Файл не выбран'}
                    </button>
                  </Link>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className='mb-5 max-[500px]:mb-5'>
                <Filter values={work_types.map((type) => type.name)} updateFilteredValues={setWorkType} type={'none'} />
              </div>
            </div>
            <div className=' w-[600px] flex flex-col max-xl:w-[500px]  items-end max-[700px]:w-[400px] max-[500px]:w-[300px]'>
              <div className={`flex items-center justify-center w-full border border-gray-500 ml-5 mb-5`} style={{ minHeight: '300px' }}>
                <input type="file" ref={photoInputRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
                <div className="absolute" onClick={handleClickPhoto}>
                  <button className="w-48 bg-white h-11 border rounded-[4px] border-gray-500  font-semibold text-base text-black hover:bg-black hover:text-white transition-all">
                    Выбрать файл
                  </button>
                </div>
                <div className='overflow-hidde flex justify-center items-center' style={{ minHeight: '300px' }}>
                  {blobPhoto ? (
                  <img className='object-cover' src={blobPhoto ? URL.createObjectURL(blobPhoto) : ''} alt='uploaded' />
                  ) : (
                  <div style={{ height: '100%' }}/>
                  )}
                </div>
              </div>
              <div className='mb-10 max-[500px]:mb-5'>
                <label className="label cursor-pointer w-36">
                  <input
                    type="checkbox"
                    name="markupWithBackground"
                    checked={formData.markupWithBackground}
                    className='checkbox'
                    onChange={(e) => setFormData({ ...formData, markupWithBackground: e.target.checked })}
                  />
                  <span className="text-md opacity-75">Фото диплома</span> 
                </label>
              </div>
            </div>
          </div>

          <div className='flex justify-end pt-5 max-[1200px]:justify-start'>
            <button 
              type='submit'
              onClick={handleButtonClick}
              className=" w-72 h-14 font-semibold text-lg text-white bg-black hover:bg-white hover:text-black hover:border-black hover:border transition-all">
                Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Publication