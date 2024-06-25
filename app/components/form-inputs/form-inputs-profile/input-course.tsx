

interface Props {
    selectedCourse: any
    setSelectedCourse: any
}


export default function InputCourse({selectedCourse, setSelectedCourse}: Props) {
    

    const course = [1, 2, 3, 4]


    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setSelectedCourse(selectedValue);
    };


    return (
        <div>
            <select required className="select select-bordered max-w-xs rounded-none w-full" value={selectedCourse} onChange={handleSelectChange}>
                <option disabled selected>Курс..</option>
                {course && course.map((value: any) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
}