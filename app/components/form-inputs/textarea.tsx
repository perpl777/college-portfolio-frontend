


interface Props {
    placeholder: string
    name: string
}


export default function Textarea({placeholder, name}: Props) {

    return (
        <label className="border border-gray-400 flex gap-2 items-center  w-full">
            <textarea 
                className="grow outline-none px-5 pt-5 rounded-sm" 
                placeholder={placeholder} 
                name={name}
                style={{ whiteSpace: "nowrap", overflow: "hidden" }}
            />
        </label>
    );
}