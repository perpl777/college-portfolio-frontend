import { fetcher } from '@/lib/api';
import React, { useEffect, useState } from 'react';

type FilterData = {
  [category: string]: string[];
};

interface Post {
  id: number;
}

interface TagCategory {
  id: number;
  attributes: {
    category: string;
  };
}

interface Tag {
  id: number;
  attributes: {
    name: string;
    tags_category: {
      data: TagCategory;
    };
    posts: {
      data: Post[];
    };
  };  
}

type FilterComponentProps = {
  onFiltersChange: (selectedFilters: string[]) => void;
};


const FilterComponent: React.FC<FilterComponentProps> = ({ onFiltersChange }) => {
  const [openedCategory, setOpenedCategory] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  let [tags, setTags] = useState<Tag[] | null>(null);

  //Получение данных из бд
  useEffect(() => {     
    const fetchData = async () => {       
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/tags?populate=*`);
    const data = await response.json();
    setTags(data.data);
    };
    fetchData();   
  }, []);


  //Обновление родительского компонента при изменении фильтров
  useEffect(() => {
    onFiltersChange(selectedFilters);
  }, [selectedFilters, onFiltersChange]);


  //Анимация фильтра
  const toggleCategory = (category: string) => {
    setOpenedCategory(openedCategory === category ? null : category);
  };

  const toggleFilter = (item: string) => {
    setSelectedFilters((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]
    );
  };

  const transformedData = tags?.reduce((acc, tag) => {
    const category = tag.attributes.tags_category.data.attributes.category;
    
    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(tag.attributes.name);
    
    return acc;
  }, {} as Record<string, string[]>);


  return (
    <div>
      <details className="collapse bg-white border-2 border-slate-200 rounded-sm"> 
        <summary className="collapse-title text-lg h-2 font-medium p-0 min-w-44">
          <span className="flex items-center justify-center h-full mx-2">
            #теги
          </span>
        </summary>
        <div className="collapse-content capitalize p-0"> 
          <div>
            <div className='font-light'>
              {selectedFilters.map((filter) => (
                <label key={filter} className="block px-3 py-1 flex row items-start border-t-2 border-slate-200">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="checkbox checkbox-xs m-1"
                    onChange={() => toggleFilter(filter)}
                  />
                  {filter}
                </label>
              ))}
            </div>

            <div>
              {Object.keys(transformedData ?? {}).map((category) => (
                <div key={category} className="mb-1 border-t-2 border-slate-200">
                  <div
                    onClick={() => toggleCategory(category)}
                    className={`cursor-pointer text-sm text-slate-300 mx-3 my-1 tracking-wide`}
                  >
                    {category}
                  </div>
                  {openedCategory === category && (
                    <div className="ml-7">
                      {transformedData![category]
                        .filter((item) => !selectedFilters.includes(item))
                        .map((item) => (
                          <label key={item} className="block flex row items-start">
                            <input
                              type="checkbox"
                              defaultChecked={selectedFilters.includes(item)}
                              className="checkbox checkbox-xs m-1"
                              onChange={() => toggleFilter(item)}
                            />
                            {item}
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
};

export default FilterComponent;
// ${openedCategory === category ? 'font-bold' : 'font-medium'}