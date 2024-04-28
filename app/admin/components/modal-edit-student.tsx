'use client'
import React, {useState, useEffect} from 'react';
import {fetcher} from "@/lib/api"
import FormProfile from './forms/form-profile';


interface ModalProps {
    id?: number;
    openModal: boolean;
    handleCloseModal: () => void;
}

interface DataStudent {
    id: number,
    attributes: {
        surname: string,
        name: string,
        patronymic?: string;
        course: number,
        description: string,
        technologies: string,
        linkToGit?: string,
        linkToBehance?: string,
        linkToVK?: string,
        specialty: string,
        profilePicture: {
            data: {
                id: number,
                attributes: {
                    name: string,
                    width: number,
                    height: number,
                    url: string
                }
            }
        }
    }
}

const ModalEditPortfolio = ({id, openModal, handleCloseModal}: ModalProps) => {

    let [student, setStudent] = useState<DataStudent>();

    useEffect(() => {
        const fetchData = async () => {
            let studentResponse = [];
            studentResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/students/${id}/?populate=*`);

            setStudent(studentResponse.data);
        };

        fetchData();
    }, []);

    return (
        <dialog className="modal bg-black/30" open={openModal}>
            <div className="modal-box w-11/12 max-w-5xl p-10 rounded-none">
                <div className="modal-action absolute top-0 right-4">
                    <form method="dialog">
                        <button className='text-5xl font-light' onClick={handleCloseModal}>&times;</button>
                    </form>
                </div>

                {student &&
                    <FormProfile 
                        surname={student.attributes.surname}
                        name={student.attributes.name}
                        patronymic={student.attributes.patronymic}
                        description={student.attributes.description}
                        course={student.attributes.course}
                        specialty={student.attributes.specialty}
                        technologies={student.attributes.technologies}
                        linkToGit={student.attributes.linkToGit}
                        linkToBehance={student.attributes.linkToBehance}
                        linkToVK={student.attributes.linkToVK}
                        profilePicture={student.attributes.profilePicture?.data?.attributes?.url}
                        handleClose={handleCloseModal}
                    />
                }
            </div>
        </dialog>
    );
};

export default ModalEditPortfolio;