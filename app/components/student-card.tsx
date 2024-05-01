
import Image from 'next/image';
import Link from 'next/link';
import Github from '@/public/contacts-icons/bxl-github 2.svg';
import Vk from '@/public/contacts-icons/bxl-vk 2.svg';
import Behance from '@/public/contacts-icons/bxl-behance 2.svg';


interface DataStudent {
    surname: string,
    name: string,
    course: number,
    description: string,
    technologies: string,
    linkToBehance?: string,
    linkToGit?: string,
    linkToVK?: string,
    specialty:  string,
    profilePicture: string
}


const StudentCard = ({surname, name, course, description, technologies, linkToBehance, linkToGit, linkToVK, specialty, profilePicture}: DataStudent) => {

    return (
        <div className='flex max-h-[566px] max-lg:inline-block max-lg:max-h-max'>

            <Image src={profilePicture} alt="student" className='object-cover' width={602} height={566} />

            <div className="bg-gray-50 flex flex-col flex-auto justify-between py-9 px-5">
                <div className='flex justify-end gap-2 max-lg:pb-5'>
                    {linkToVK && 
                        <Link href={linkToVK} target='_blank'><Image src={Vk} alt='vk' width={50} height={50} className='max-sm:w-8 max-sm:h-8'></Image> </Link>
                    }
                    {linkToGit && 
                        <Link href={linkToGit} target='_blank'><Image src={Github} alt='github' width={50} height={50} className='max-sm:w-8 max-sm:h-8'></Image></Link>
                    }
                    {linkToBehance && 
                        <Link href={linkToBehance} target='_blank'><Image src={Behance} alt='behance' width={50} height={50} className='max-sm:w-8 max-sm:h-8'></Image></Link>
                    }
                </div>

                <div>
                    <h1 className='titleName font-medium text-6xl max-sm:text-4xl'>
                        {`${name} ${surname}`}
                    </h1>

                    <table className="table table-sm mt-12 max-sm:table-xs">
                        <tbody> 
                            <tr className='border-b border-black'> 
                                <th className="p-0 text-xs font-normal text-gray-500 uppercase max-sm:text-xs">Специальность</th> {/*выводим Специальность студента */}
                                <th className="pl-20 text-base font-normal max-sm:text-sm"> {specialty} </th>
                            </tr> 
                            <tr className='border-b border-black'> 
                                <th className="p-0 text-xs font-normal text-gray-500 uppercase max-sm:text-xs">Курс</th> {/*выводим Курс студента */}
                                <th className="pl-20 text-base font-normal max-sm:text-sm"> {course} </th>
                            </tr> 
                            <tr className='border-b border-black'> 
                                <th className="p-0 text-xs font-normal text-gray-500 uppercase max-sm:text-xs">Технологии</th> {/*выводим Технологии студента */}
                                <th className="pl-20 text-base font-normal max-sm:text-sm"> {technologies} </th>
                            </tr> 
                        </tbody> 
                    </table>
                </div>
            </div>
        </div>
    )
}

export default StudentCard