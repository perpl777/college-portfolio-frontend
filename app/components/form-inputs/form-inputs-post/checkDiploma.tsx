

interface Props {
    name: string
    checked: boolean;
    onChange: any
}


export default function CheckDiploma({name, checked, onChange}: Props) {
    return (
        <label className="label cursor-pointer w-36">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                className='checkbox'
                onChange={onChange}
            />
            <span className="text-md opacity-75">Фото диплома</span> 
        </label>
    );
}