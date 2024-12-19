'use client'
import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { fetcher } from '@/lib/api'

import Loading from './loading'

import ImagePost from './components/posts/image-post'
import SliderWithCheckbox from './components/slider-with-checkbox/slider-with-checkbox'
import Header from './components/header'
import Tags from './components/tags'

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PostsProps {
	data: DataPosts[]
}

interface DataPosts {
	id: number
	attributes: {
		title: string
		photo?: {
			data: {
				id: number
				attributes: {
					name: string
					url: string
				}
			}
		}
		published: boolean
		student: {
			data: {
				id: number
			}
		}
		worktype: {
			data: {
				id: number
				attributes: {
					name: string
				}
			}
		}
		tags: {
			data: {
				some(arg0: (tag: any) => boolean): unknown
				id: number
				attributes: {
					name: string
				}
			}
		}
	}
}

interface CategoryProps {
	id: number
	attributes: {
		name: string
		tags: {
			data: {
				id: number
				attributes: {
					name: string
				}
			}
		}
	}
}

interface TagsProps {
	id: number
	attributes: {
		name: string
		category: {
			data: {
				id: number
				attributes: {
					name: string
				}
			}
		}
	}
}

export default function Home() {
	const [posts, setPosts] = useState<PostsProps>()
	const [filteredPost, setFilteredPost] = useState<string[]>([])

	const [tags, setTags] = useState<TagsProps[]>([])
	const [tagsNames, setTagsNames] = useState<string[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])

	const [categories, setCategories] = useState<CategoryProps[]>([])
	const [selectedCategory, setSelectedCategory] = useState<string>()

	const [checkboxChecked, setCheckboxChecked] = useState<boolean>(true)

    const itemsPerPage = 12; // Количество постов на одной странице
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
    
	//фетчи
    useEffect (() => { // фетч тегов и категорий
        const fetchData = async () => {
            let tagsResponse = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/tags?populate=category&fields=name&pagination[start]=0&pagination[limit]=100`
            )
            setTags(tagsResponse.data)
            
            const namesTags = tagsResponse.data.map(
                (tag: any) => tag.attributes.name
            )
            setTagsNames(namesTags)
            
            let categoriesResponse = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/categories?populate=*`
            )
            const namesCategories = categoriesResponse.data.map(
                (category: any) => category.attributes.name
            )
            setCategories(namesCategories)
            setSelectedCategory(namesCategories[0])
        }
        fetchData()
    }, [])

	useEffect(() => { // фетч постов
		const fetchData = async () => {
            const start = (currentPage - 1) * itemsPerPage;
			let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/posts?filters[published][$eq]=true&populate=tags,photo,student&fields=title&fields=published&pagination[start]=${start}&pagination[limit]=${itemsPerPage}`
			
            if (selectedTags.length > 0) {// Если есть выбранные теги, добавляем фильтр
                const tagsFilter = selectedTags
                    .map((tag) => `filters[tags][name][$in]=${tag}`)
                    .join('&');
                url += `&${tagsFilter}`;
            }
            
            const response = await fetcher(url);
            setPosts(response);

            // Обновление общего количества страниц
            const totalItems = response.meta.pagination.total;
            setTotalPages(Math.ceil(totalItems / itemsPerPage));
            
            console.log('url', url)
		}
		fetchData()

        console.log('selectedTags:', selectedTags)
	}, [currentPage, selectedTags])

	const filteredTags = useMemo(() => {
		if (!tags) return []

		if (!checkboxChecked && selectedCategory != '') {
			let filteredData = tags.filter((tag: any) => {
				return (
					tag.attributes.category.data?.attributes.name ===
					selectedCategory
				)
			})
			let filteredDataNames = filteredData.map(
				(tag: any) => tag.attributes.name
			)
			return filteredDataNames
		} else {
			return tagsNames
		}
	}, [filteredPost, tags, selectedCategory, checkboxChecked])

	// const filteredPosts = useMemo(() => {
	// 	if (!posts) return []

	// 	let filteredData = posts.data?.filter((post: any) => {
	// 		return (
	// 			post.attributes.worktype.data.attributes.name === 'Проекты' &&
	// 			post.attributes.published &&
	// 			(filteredPost.length === 0 ||
	// 				post.attributes.tags.data.some((tag: any) =>
	// 					filteredPost.includes(tag.attributes.name)
	// 				)) &&
	// 			(checkboxChecked ||
	// 				(selectedCategory != '' &&
	// 					tags.some(
	// 						(tag: any) =>
	// 							tag.attributes.category.data?.attributes
	// 								.name === selectedCategory &&
	// 							post.attributes.tags.data.some(
	// 								(postTag: any) =>
	// 									postTag.attributes.name ===
	// 									tag.attributes.name
	// 							)
	// 					)))
	// 		)
	// 	})

	// 	return filteredData
	// }, [posts, filteredPost, categories, tags, selectedCategory, checkboxChecked,])

	//фильтр по тэгам
	const handleTagFilter = (tag: string) => {
		if (selectedTags.includes(tag)) {
			setSelectedTags(selectedTags.filter((t) => t !== tag))
		} else {
			setSelectedTags([...selectedTags, tag])
		}
		if (filteredPost.includes(tag)) {
			setFilteredPost(filteredPost.filter((t) => t !== tag))
		} else {
			setFilteredPost([...filteredPost, tag])
		}
	}

    const handlePagination = (event: React.ChangeEvent<unknown>, page: number) => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
		setCurrentPage(page)
	}

	return (
		<div>
			<Header />
			<div className='px-11 pt-14 pb-11 space-y-9 max-sm:p-4 max-sm:pb-5 max-sm:pt-9 max-sm:space-y-5 max-lg:space-y-10'>
				<SliderWithCheckbox
					values={categories}
					setSelectedCategory={setSelectedCategory}
					checkboxChecked={checkboxChecked}
					setCheckboxChecked={setCheckboxChecked}
				/>
				<Tags
					tags={filteredTags}
					filteredPost={filteredPost}
					handleTagFilter={handleTagFilter}
					selectedTags={selectedTags}
				/>
			</div>
			<div className='px-11 pb-10 grid grid-cols-3 gap-4 max-sm:gap-6 max-sm:p-4 max-xl:grid-cols-2 max-sm:grid-cols-1'>
				{posts &&
					posts.data.map((post: any) => {
						return (
							<Suspense fallback={<Loading />} key={post.id}>
								<ImagePost
									href={`/portfolio/${post.attributes.student?.data?.id}/post/${post.id}`}
									studentId={post.attributes.student.data.id}
									postId={post.id}
									photo={
										post?.attributes?.photo?.data
											?.attributes?.url
									}
									title={post.attributes.title}
								/>
							</Suspense>
						)
					})}
			</div>

            {/* Pagination Controls */}
			<div className="flex justify-center mt-10 mb-20 space-x-2">
				<Stack spacing={2}>
					<Pagination
						count={totalPages}
						shape="rounded"
						size="large"
						page={currentPage}
						onChange={handlePagination}
					/>
				</Stack>
			</div>
		</div>
	)
}
