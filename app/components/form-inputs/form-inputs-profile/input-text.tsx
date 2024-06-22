

interface Props {
    placeholder: string
    name: string
}


export default function InputText({placeholder, name}: Props) {

    return (
        <label className="border-b border-gray-400 flex gap-2 items-center w-full">
            <input 
                type="text" 
                name={name}
                className="grow outline-none p-2 w-full" 
                placeholder={placeholder}
            />
        </label>
    );
}