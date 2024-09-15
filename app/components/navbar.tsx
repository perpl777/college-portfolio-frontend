

interface Props {
    values: string[];
    handleCategoryClick: (value: string) => void;
    selectedBtn: string;
}


const Navbar = ({values, handleCategoryClick, selectedBtn }: Props) => {
    const filteredValues = values.filter((value) => value !== selectedBtn);
    
    return (
        <div className="space-x-8 max-sm:space-x-4">
            {filteredValues.map((value) => (
                <button
                    onClick={() => handleCategoryClick(value)}
                    key={value}
                    className="transition hover:text-gray-700 uppercase text-lg text-gray-500 max-sm:text-sm"
                >
                    {value}
                </button>
            ))}
            {selectedBtn && (
                <button
                    onClick={() => handleCategoryClick(selectedBtn)}
                    className="uppercase text-black font-medium text-4xl max-sm:text-xl"
                    key="active"
                >
                    {selectedBtn}
                </button>
            )}
        </div>
    )
}

export default Navbar;
