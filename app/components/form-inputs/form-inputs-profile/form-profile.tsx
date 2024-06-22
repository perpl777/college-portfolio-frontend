

import GithubIcon from '@/public/contacts-icons/bxl-github 2.svg'
import VkIcon from '@/public/contacts-icons/bxl-vk 2.svg'
import BehanceIcon from '@/public/contacts-icons/bxl-behance 2.svg'

import InputTechnology from './input-technology';
import InputSpecializations from './input-specilalizations';
import InputCourse from './input-course';
import InputPhoto from '../input-photo';
import InputText from './input-text';
import Textarea from '../textarea';
import InputContacts from './input-contacts';



export default function FormProfile() {
    return (
    <div>
        <form>
            <div className='grid grid-cols-2 gap-16 max-lg:grid-cols-1'>
                <div className='space-y-10'>
                    <InputText placeholder={'Фамилия'} name={'surname'}/>
                    <InputText placeholder={'Имя'} name={'name'}/>
                    <InputText placeholder={'Отчество'} name={'patronymic'}/>
                    <InputTechnology />
                    <div className='flex gap-8 max-sm:flex-col'>
                        <InputSpecializations />
                        <InputCourse />
                    </div>
                </div>
                <div className='max-lg:w-full max-lg:h-96 max-sm:h-64'>
                    <InputPhoto />
                </div>
            </div>

            <div className='pt-14'>
                <Textarea placeholder='О себе..' name={'about_info'}/>
            </div>

            <div className='pt-6'>
                <InputContacts srcImage={BehanceIcon} placeholder='Ссылка на Behance..' name='url_behance'/>
                <InputContacts srcImage={GithubIcon} placeholder='Ссылка на Github..' name='url_github'/>
                <InputContacts srcImage={VkIcon} placeholder='Ссылка на Vk..' name='url_vk'/>
            </div>

            <div className='w-full flex justify-end pt-2 max-md:pt-10 max-md:justify-center'>
                <button 
                    type='submit'
                    className=" w-72 h-14 font-semibold text-lg text-white bg-zinc-900 hover:bg-white hover:text-black hover:border-black hover:border transition-all">
                        Сохранить
                </button>
            </div>
        </form>
    </div>
    );
}