

interface Props {
    values: any;
    handleCategoryClick: any;
    activeButton: any;
}


const Navbar = ({values, handleCategoryClick, activeButton }: Props) => {

    return  (
        <div className={`space-x-8 max-sm:space-x-4`}>
            {values && values.map((value: any, index: any) => (
                <button
                    onClick={() => handleCategoryClick(index, value)}
                    key={index}
                    className={`uppercase ${index === activeButton ? 'text-black font-medium text-4xl max-sm:text-2xl' : 'text-lg text-gray-500 max-sm:text-sm'}  `}
                >
                    {value}
                </button>
            ))}
        </div>
    )
}

export default Navbar;
