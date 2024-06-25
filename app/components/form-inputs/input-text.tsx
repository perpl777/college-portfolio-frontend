

interface Props {
    placeholder: string
    name: string
    value: any
    onChange: any
}


export default function InputText({placeholder, name, value, onChange}: Props) {

    return (
        <label className="border-b border-gray-400 flex gap-2 items-center w-full">
            <input 
                type="text" 
                name={name}
                className="grow outline-none p-2 w-full capitalize" 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={{ color: 'black' } }
            />
        </label>
    );
}