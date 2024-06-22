import DropDownInput from "../dropdown-input";


export default function InputCourse() {
    const course = [1, 2, 3, 4]

    return (
        <div>
            <DropDownInput values={course} placeholder="Курс.."/>
        </div>
    );
}