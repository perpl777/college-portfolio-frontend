
import Image from 'next/image';
import Link from 'next/link';
import Github from '@/public/contacts-icons/bxl-github 2.svg';
import Vk from '@/public/contacts-icons/bxl-vk 2.svg';
import Behance from '@/public/contacts-icons/bxl-behance 2.svg';


interface DataStudent {
    surname: string,
    name: string,
    course: number,
    technologies: any,
    url_behance?: string,
    url_github?: string,
    url_vk?: string,
    specialization?: string,
    photo?: string,
}


const StudentCard = ({surname, name, course, technologies, url_behance, url_github, url_vk, specialization, photo}: DataStudent) => {
    return (
        <div className='flex max-h-[566px] max-lg:inline-block max-lg:max-h-max'>
            {photo && 
                <Image src={photo}
                    alt="student" 
                    className='object-cover max-sm:w-full'
                    width={602} 
                    height={566} 
                    quality={80}
                    priority
                />
            }
            <div className="bg-gray-50 flex flex-col flex-auto justify-between py-10 px-6">
                <div className='flex justify-end max-sm:pb-4'>
                    <p className='w-20 text-gray-500 border border-gray-400 uppercase p-1 text-center montserrat text-sm max-sm:text-xs'>топ 1</p>
                </div>
                <div>
                    <h1 className='titleName font-medium text-6xl max-sm:text-4xl'>
                        {`${name} ${surname}`}
                    </h1>

                    <table className="table table-sm mt-6 max-sm:table-xs">
                        <tbody> 
                            <tr className='border-b border-black'> 
                                <th className="p-0 text-xs font-normal text-gray-500 uppercase max-sm:text-xs">Специальность</th> {/*выводим Специальность студента */}
                                <th className="pl-20 max-sm:pl-0 text-base font-normal max-sm:text-sm"> {specialization} </th>
                            </tr> 
                    
                            <tr className='border-b border-black'> 
                                <th className="p-0 text-xs font-normal text-gray-500 uppercase max-sm:text-xs">Курс</th> {/*выводим Курс студента */}
                                <th className="pl-20 max-sm:pl-0  text-base font-normal max-sm:text-sm"> {course} </th>
                            </tr> 

                            <tr className='border-b border-black'> 
                                <th className="p-0 text-xs font-normal text-gray-500 uppercase max-sm:text-xs">Технологии</th> {/*выводим Технологии студента */}
                                <th className="pl-20 max-sm:pl-0  text-base font-normal max-sm:text-sm">{technologies.length > 0 ? technologies : "Не указано"}</th>
                            </tr> 
                        </tbody> 
                    </table>

                    <div className='flex mt-8 gap-4'>
                        {url_vk && 
                            <Link href={url_vk} target='_blank'><Image src={Vk} alt='vk' width={45} height={45} className='max-sm:w-10 max-sm:h-10'></Image> </Link>
                        }
                        {url_github && 
                            <Link href={url_github} target='_blank'><Image src={Github} alt='github' width={45} height={45} className='max-sm:w-10 max-sm:h-10'></Image></Link>
                        }
                        {url_behance && 
                            <Link href={url_behance} target='_blank'><Image src={Behance} alt='behance' width={45} height={45} className='max-sm:w-10 max-sm:h-10'></Image></Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentCard