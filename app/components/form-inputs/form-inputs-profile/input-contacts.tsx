import Image from "next/image";


interface Props {
    srcImage: any;
    placeholder: string;
    name: string;
}


export default function InputContacts({srcImage, placeholder, name}: Props) {
    return (
        <div className='flex w-96 gap-4 max-sm:w-full'>
            <Image src={srcImage} alt={placeholder}/>
            <label className="my-4 border-b border-gray-400 flex gap-2 items-center w-full">
                <input 
                    type="text" 
                    className="grow outline-none p-2 w-full" 
                    placeholder={placeholder}
                    name={name}
                />
            </label>
        </div>
    );
}