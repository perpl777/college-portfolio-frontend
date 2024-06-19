

interface CheckDiplomaProps {
    value: boolean;
}

const CheckDiploma: React.FC<CheckDiplomaProps> = ({value}) => {
    return (
        <>
            <div className="form-control">
                <label className="label cursor-pointer w-36">
                    <input type="checkbox" defaultChecked className="checkbox" checked={value}/>
                    <span className="text-md opacity-75">Фото диплома</span> 
                </label>
            </div>
        </>
    );
};

export default CheckDiploma
