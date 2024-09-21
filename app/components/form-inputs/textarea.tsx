


interface Props {
    placeholder: string
    name: string
    required: any
    value: any
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}



export default function Textarea({ placeholder, name, value, onChange }: Props) {
    return (
        <label className="border border-gray-400 flex gap-2 items-center w-full rounded-[4px]">
            <textarea
                className="min-h-40 grow whitespace-normal outline-none px-5 pt-5 rounded-[4px]"
                placeholder={placeholder}
                name={name}
                style={{ color: 'black'  }}
                onChange={onChange}
                value={value}
            />
        </label>
    );
}
