import React, { Suspense } from 'react';
import Loading from '../../loading'
import Table from '../students/students-table';

interface Props {
    filteredStudents: any
}

export default function UnpublishedProfiles({ filteredStudents }: Props) {
    return (
        <div className='px-11 max-sm:p-6'>
            {filteredStudents && filteredStudents.length !== 0
            ?
                <Suspense fallback={<Loading />}>
                    <Table students={filteredStudents} studentLinks={{ href: `moderation/profile` }} enableRating={false}/>
                </Suspense>
            :
                (<div className="text-center text-zinc-400 text-lg mt-16">Все профили проверены</div>)
            }
        </div> 
    );
}