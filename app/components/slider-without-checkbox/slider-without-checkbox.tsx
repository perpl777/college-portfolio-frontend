

interface Props {
    values: any;
    handleCategoryClick: any;
    activeButton: any;
}


const SliderWithoutCheckbox = ({values, handleCategoryClick, activeButton }: Props) => {
    
    
    const stylesAdaptive = {
        menu: 'overflow-x-auto whitespace-nowrap',
        button: 'max-md:text-base',
    }

    
    return  (
        <div className={`flex items-center space-x-9 ${stylesAdaptive.menu}`}>
            {values && values.map((value: any, index: any) => (
                <button
                    onClick={() => handleCategoryClick(index, value)}
                    key={index}
                    className={`text-left text-lg text-black p-2 ${index === activeButton ? 'border-b-2 border-black' : ''} ${stylesAdaptive.button}`}
                >
                    {value}
                </button>
            ))}
        </div>
    )
}

export default SliderWithoutCheckbox;
