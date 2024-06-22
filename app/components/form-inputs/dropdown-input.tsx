


interface DropDownInputProps {
    values: any[];
    placeholder: string;
}



export default function DropDownInput({ values, placeholder }: DropDownInputProps) {
    return (
    <select className="select select-bordered max-w-xs rounded-none w-full">
        <option disabled selected>{placeholder}</option>
        {values.map((value: any) => (
            <option key={value} value={value}>
                {value}
            </option>
        ))}
    </select>
    );
}