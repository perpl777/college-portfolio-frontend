import React from 'react';

interface TagsProps {
    tags: string[];
    filteredPost: string[];
    handleTagFilter: (tag: string) => void;
    selectedTags: any;
}

const Tags: React.FC<TagsProps> = ({ tags, filteredPost, handleTagFilter, selectedTags}) => {
    return (
        <div className="overflow-x-auto overflow-y-hidden">
            <div className="flex gap-4 flex-wrap max-h-[50vh] min-w-[800px] ">
                {tags && tags?.map((tag: any) => {
                    return (
                        <label 
                            key={tag} 
                            className={`cursor-pointer px-3 border rounded-sm border-gray-300 py-1 text-sm text-gray-800 transition-colors ${selectedTags.includes(tag) ? 'bg-gray-200 border-gray-300/0' : ''}`} 
                            style={{ userSelect: 'none' }}>
                            <input
                                type="checkbox"
                                checked={filteredPost.includes(tag)}
                                onChange={() => handleTagFilter(tag)}
                                className="hidden"
                            />
                            # {tag}
                        </label>
                    )
                })}
            </div>
        </div>
    );
};

export default Tags;