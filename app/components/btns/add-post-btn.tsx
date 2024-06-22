
import Image from "next/image";
import Plus from '@/public/plus.svg'
import Link from "next/link";


interface Props {
    id: any
    user: any
    setError: any
    checkProfile: any
}


export default function BtnAddPost({id, user, setError, checkProfile}: Props) {

    const handleClick = () => {
        if (!checkProfile) {
            setError('error')
        }
        else {
            window.location.href = `/myprofile/${id}/add-post/${user?.student.id}`
        }
    }

    return (
    <>
        <button onClick={handleClick} className='flex aspect-square items-center justify-center w-full h-full border border-gray-400 hover:bg-zinc-100'>
                <div className="absolute">
                    <Image src={Plus} alt="add photo" className='m-auto'/>
                    <p className="text-gray-400 text-base pt-5">Добавить фото</p>
                </div>
        </button>
    </>
    );
}